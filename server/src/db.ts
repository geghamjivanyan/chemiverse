import pg from 'pg';
import { env } from './env';

// Пул соединений к Postgres (читаем DATABASE_URL из .env).
export const pool = new pg.Pool({
  connectionString: env.databaseUrl,
  max: 8,
});
