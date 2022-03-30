import { createLogger, format, transports } from "winston";

const timestampFormat = { format: "YYYY-MM-DD HH:mm:ss" };

const logFormat = format.printf(({ level, message, label, timestamp }) => {
  if (label) {
    return `[${timestamp}][${level}][${label}] ${message}`;
  }
  return `[${timestamp}][${level}] ${message}`;
});

export const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(timestampFormat), logFormat),
  transports: [
    new transports.File({ filename: "log/info.log" }),
    new transports.File({ filename: "log/error.log", level: "error" }),
  ],
});

// Local dev would have the NODE_ENV undefined -- also output logs to console in this case
if (!process.env.NODE_ENV) {
  logger.add(new transports.Console());
}

export const sqlLogger = createLogger({
  level: "info",
  format: format.combine(
    format.label({ label: "SQL" }),
    format.timestamp(timestampFormat),
    logFormat
  ),
  transports: new transports.File({ filename: "log/sql.log" }),
});
