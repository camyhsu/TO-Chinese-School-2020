import winston from 'winston';
import config from 'config';

const { createLogger, transports } = winston;

export default createLogger({
  level: config.logging.level,
  transports: new transports.Console(),
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.printf((info) => `[${info.level}][${[info.timestamp]}] ${info.message}`),
  ),
});
