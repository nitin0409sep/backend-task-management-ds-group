import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const useSsl = process.env.DB_SSL === 'true';
const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true';

export default defineConfig({
  schema: './src/db/schema/migration.schema.ts',
  out: './src/db/migrations',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'task_manager',
    ssl: useSsl ? { rejectUnauthorized } : undefined,
  },
});
