import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import { env } from '../config/env.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const procedureFiles = ['task-dashboard.sql', 'admin-summary.sql'];

const run = async () => {
  const connection = await mysql.createConnection({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    ssl: env.DB_SSL ? { rejectUnauthorized: env.DB_SSL_REJECT_UNAUTHORIZED } : undefined,
    multipleStatements: true,
  });

  try {
    for (const file of procedureFiles) {
      const sql = await readFile(path.join(currentDir, 'procedures', file), 'utf8');
      await connection.query(sql);
      console.log(`Applied ${file}`);
    }
  } finally {
    await connection.end();
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
