const timestamp = () => new Date().toISOString();

const write = (level: 'INFO' | 'ERROR', message: string, meta?: unknown) => {
  const line = `[${timestamp()}] ${level} ${message}`;
  if (meta === undefined) {
    level === 'ERROR' ? console.error(line) : console.log(line);
    return;
  }

  level === 'ERROR' ? console.error(line, meta) : console.log(line, meta);
};

export const logger = {
  info(message: string, meta?: unknown) {
    write('INFO', message, meta);
  },
  error(message: string, meta?: unknown) {
    write('ERROR', message, meta);
  },
};
