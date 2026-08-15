import Fastify from 'fastify';
import { env, isProd } from './env';
import { pool } from './db';
import { setupAuth } from './auth';

const app = Fastify({
  logger: {
    level: isProd ? 'info' : 'debug',
    transport: isProd ? undefined : { target: 'pino-pretty' },
  },
});

app.get('/api/health', async () => ({
  status: 'ok',
  service: 'chemverse-server',
  env: env.nodeEnv,
  db: env.databaseUrl ? 'configured' : 'missing',
  time: new Date().toISOString(),
}));

// Полные данные элемента по символу (для страницы элемента)
app.get<{ Params: { symbol: string } }>('/api/elements/:symbol', async (req, reply) => {
  const { rows } = await pool.query('SELECT data FROM elements WHERE symbol = $1', [req.params.symbol]);
  if (!rows[0]) return reply.code(404).send({ error: 'not_found', symbol: req.params.symbol });
  return rows[0].data;
});

// Сколько молекул в базе
app.get('/api/molecules/stats', async () => {
  const { rows } = await pool.query(
    'SELECT count(*)::int AS total, count(DISTINCT formula)::int AS formulas FROM molecules',
  );
  return rows[0];
});

// Поиск молекул по названию (для будущего меню/строки поиска)
app.get<{ Querystring: { q?: string } }>('/api/molecules/search', async (req) => {
  const q = (req.query.q ?? '').trim();
  if (q.length < 2) return [];
  const { rows } = await pool.query(
    `SELECT cid, formula, name, name_ru, name_hy FROM molecules
     WHERE name ILIKE $1 OR name_ru ILIKE $1 OR name_hy ILIKE $1 OR formula ILIKE $2
     ORDER BY (name_ru IS NULL AND name_hy IS NULL), (name IS NULL), length(coalesce(name, formula)), cid
     LIMIT 20`,
    [`%${q}%`, `${q}%`],
  );
  return rows;
});

// Поиск веществ (энциклопедия Wikidata) по имени en/ru/hy
app.get<{ Querystring: { q?: string } }>('/api/substances/search', async (req) => {
  const q = (req.query.q ?? '').trim();
  if (q.length < 2) return [];
  const { rows } = await pool.query(
    `SELECT qid, name_en, name_ru, name_hy, formula FROM substances
     WHERE name_en ILIKE $1 OR name_ru ILIKE $1 OR name_hy ILIKE $1
     ORDER BY (name_ru IS NULL AND name_hy IS NULL), length(coalesce(name_ru, name_en, '')), qid
     LIMIT 15`,
    [`%${q}%`],
  );
  return rows;
});

// Одно вещество по Wikidata QID
app.get<{ Params: { qid: string } }>('/api/substances/:qid', async (req, reply) => {
  const { rows } = await pool.query('SELECT * FROM substances WHERE qid = $1', [req.params.qid]);
  if (!rows[0]) return reply.code(404).send({ error: 'not_found' });
  return rows[0];
});

// Молекула по формуле (Хилл): берём простейший/самый ранний представитель с названием
app.get<{ Params: { formula: string } }>('/api/molecules/:formula', async (req, reply) => {
  const { formula } = req.params;
  const { rows } = await pool.query(
    `SELECT cid, formula, name, name_ru, name_hy, atom_count, geometry
     FROM molecules WHERE formula = $1
     ORDER BY (name_ru IS NULL AND name_hy IS NULL), (name IS NULL), heavy_atom_count, cid LIMIT 1`,
    [formula],
  );
  if (!rows[0]) return reply.code(404).send({ error: 'not_found', formula });
  return rows[0];
});

async function main() {
  try {
    await setupAuth(app);
    // Слушаем только localhost — наружу проксирует nginx.
    await app.listen({ port: env.port, host: '127.0.0.1' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

void main();
