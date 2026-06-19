import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { closeDb } from './db/index.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`API listening on port ${env.PORT}`);
});

const shutdown = async (signal: NodeJS.Signals) => {
  logger.info(`${signal} received, closing server`);

  server.close(async (error) => {
    if (error) {
      logger.error('HTTP server closed with an error', error);
      process.exit(1);
    }

    await closeDb();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
