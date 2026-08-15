import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import cookie from '@fastify/cookie';
import { pool } from './db';
import { env, isProd } from './env';

const SESSION_DAYS = 90;
const COOKIE = 'session';

// ---------- пароли (scrypt, встроенный crypto) ----------
function hashPassword(pw: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(pw, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}
function verifyPassword(pw: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const a = scryptSync(pw, salt, 64);
  const b = Buffer.from(hash, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}

// ---------- публичная форма пользователя ----------
interface DbUser {
  id: string;
  google_id: string | null;
  email: string | null;
  nickname: string | null;
  name: string | null;
  avatar_url: string | null;
  is_guest: boolean;
}
function publicUser(u: DbUser) {
  return {
    id: u.id,
    nickname: u.nickname,
    name: u.name ?? u.nickname,
    email: u.email,
    avatarUrl: u.avatar_url,
    isGuest: u.is_guest,
  };
}

// ---------- сессии ----------
async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString('hex');
  await pool.query(
    `INSERT INTO sessions (token, user_id, expires_at) VALUES ($1,$2, now() + interval '${SESSION_DAYS} days')`,
    [token, userId],
  );
  return token;
}
function setSessionCookie(reply: FastifyReply, token: string) {
  reply.setCookie(COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 3600,
  });
}
export async function getUser(req: FastifyRequest): Promise<ReturnType<typeof publicUser> | null> {
  const token = req.cookies?.[COOKIE];
  if (!token) return null;
  const { rows } = await pool.query<DbUser>(
    `SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token = $1 AND s.expires_at > now()`,
    [token],
  );
  return rows[0] ? publicUser(rows[0]) : null;
}

// ---------- Google OAuth (вручную, без лишних зависимостей) ----------
const GOOGLE_AUTH = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO = 'https://openidconnect.googleapis.com/v1/userinfo';

export async function setupAuth(app: FastifyInstance) {
  await app.register(cookie, { secret: env.sessionSecret });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      google_id TEXT UNIQUE,
      email TEXT,
      nickname TEXT UNIQUE,
      password_hash TEXT,
      name TEXT,
      avatar_url TEXT,
      is_guest BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT now(),
      expires_at TIMESTAMPTZ NOT NULL
    );
    CREATE TABLE IF NOT EXISTS discoveries (
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      formula TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now(),
      PRIMARY KEY (user_id, formula)
    );
  `);

  // кто вошёл
  app.get('/api/me', async (req) => ({ user: await getUser(req) }));

  // прогресс: открытые молекулы (привязаны к пользователю)
  app.get('/api/progress', async (req) => {
    const user = await getUser(req);
    if (!user) return { discoveries: [] };
    const { rows } = await pool.query<{ formula: string }>('SELECT formula FROM discoveries WHERE user_id = $1', [user.id]);
    return { discoveries: rows.map((r) => r.formula) };
  });

  // записать открытия (один или пачка) + вернуть полный набор (для слияния гостевого прогресса)
  app.post<{ Body: { formulas?: string[] } }>('/api/progress', async (req) => {
    const user = await getUser(req);
    if (!user) return { discoveries: [] };
    const formulas = [...new Set((req.body.formulas ?? []).filter((f) => typeof f === 'string' && f.length <= 64))].slice(0, 5000);
    if (formulas.length) {
      const values = formulas.map((_, i) => `($1, $${i + 2})`).join(',');
      await pool.query(`INSERT INTO discoveries (user_id, formula) VALUES ${values} ON CONFLICT DO NOTHING`, [user.id, ...formulas]);
    }
    const { rows } = await pool.query<{ formula: string }>('SELECT formula FROM discoveries WHERE user_id = $1', [user.id]);
    return { discoveries: rows.map((r) => r.formula) };
  });

  // гость
  app.post('/api/auth/guest', async (req, reply) => {
    const { rows } = await pool.query<DbUser>(
      `INSERT INTO users (is_guest, name) VALUES (true, 'Гость') RETURNING *`,
    );
    const token = await createSession(rows[0]!.id);
    setSessionCookie(reply, token);
    return { user: publicUser(rows[0]!) };
  });

  // регистрация по нику
  app.post<{ Body: { nickname?: string; password?: string } }>(
    '/api/auth/register',
    async (req, reply) => {
      const nickname = (req.body.nickname ?? '').trim();
      const password = req.body.password ?? '';
      if (nickname.length < 2 || nickname.length > 24)
        return reply.code(400).send({ error: 'nickname_length' });
      if (password.length < 6) return reply.code(400).send({ error: 'password_short' });
      const exists = await pool.query('SELECT 1 FROM users WHERE lower(nickname) = lower($1)', [nickname]);
      if (exists.rowCount) return reply.code(409).send({ error: 'nickname_taken' });
      const { rows } = await pool.query<DbUser>(
        `INSERT INTO users (nickname, password_hash, name) VALUES ($1,$2,$1) RETURNING *`,
        [nickname, hashPassword(password)],
      );
      const token = await createSession(rows[0]!.id);
      setSessionCookie(reply, token);
      return { user: publicUser(rows[0]!) };
    },
  );

  // вход по нику
  app.post<{ Body: { nickname?: string; password?: string } }>(
    '/api/auth/login',
    async (req, reply) => {
      const nickname = (req.body.nickname ?? '').trim();
      const password = req.body.password ?? '';
      const { rows } = await pool.query<DbUser & { password_hash: string | null }>(
        'SELECT * FROM users WHERE lower(nickname) = lower($1)',
        [nickname],
      );
      const u = rows[0];
      if (!u || !u.password_hash || !verifyPassword(password, u.password_hash))
        return reply.code(401).send({ error: 'bad_credentials' });
      const token = await createSession(u.id);
      setSessionCookie(reply, token);
      return { user: publicUser(u) };
    },
  );

  // выход
  app.post('/api/auth/logout', async (req, reply) => {
    const token = req.cookies?.[COOKIE];
    if (token) await pool.query('DELETE FROM sessions WHERE token = $1', [token]);
    reply.clearCookie(COOKIE, { path: '/' });
    return { ok: true };
  });

  // Google — старт
  app.get('/api/auth/google', async (req, reply) => {
    if (!env.google.clientId) return reply.code(500).send({ error: 'google_not_configured' });
    const state = randomBytes(16).toString('hex');
    reply.setCookie('oauth_state', state, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 600,
    });
    const url =
      `${GOOGLE_AUTH}?client_id=${encodeURIComponent(env.google.clientId)}` +
      `&redirect_uri=${encodeURIComponent(env.google.redirectUri)}` +
      `&response_type=code&scope=${encodeURIComponent('openid email profile')}` +
      `&state=${state}&access_type=online&prompt=select_account`;
    return reply.redirect(url);
  });

  // Google — возврат
  app.get<{ Querystring: { code?: string; state?: string } }>(
    '/api/auth/google/callback',
    async (req, reply) => {
      const { code, state } = req.query;
      if (!code || !state || state !== req.cookies?.oauth_state)
        return reply.code(400).send({ error: 'bad_state' });
      reply.clearCookie('oauth_state', { path: '/' });

      const tokenRes = await fetch(GOOGLE_TOKEN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: env.google.clientId,
          client_secret: env.google.clientSecret,
          redirect_uri: env.google.redirectUri,
          grant_type: 'authorization_code',
        }),
      });
      if (!tokenRes.ok) return reply.code(502).send({ error: 'token_exchange' });
      const tok = (await tokenRes.json()) as { access_token: string };

      const infoRes = await fetch(GOOGLE_USERINFO, {
        headers: { Authorization: `Bearer ${tok.access_token}` },
      });
      if (!infoRes.ok) return reply.code(502).send({ error: 'userinfo' });
      const info = (await infoRes.json()) as { sub: string; email?: string; name?: string; picture?: string };

      const { rows } = await pool.query<DbUser>(
        `INSERT INTO users (google_id, email, name, avatar_url)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (google_id) DO UPDATE SET email = EXCLUDED.email, name = EXCLUDED.name, avatar_url = EXCLUDED.avatar_url
         RETURNING *`,
        [info.sub, info.email ?? null, info.name ?? null, info.picture ?? null],
      );
      const session = await createSession(rows[0]!.id);
      setSessionCookie(reply, session);
      return reply.redirect('/app');
    },
  );
}
