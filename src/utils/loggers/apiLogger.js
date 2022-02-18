import winston from 'winston';
const { format, transports } = winston;
const { combine, splat, timestamp, colorize, simple, printf, label, prettyPrint, uncolorize } = format;

export const apiLogger = winston.createLogger({
  levels: winston.config.syslog.levels,
  format: combine(
    splat(),
    timestamp({ format: 'YYYY-MM-DDTHH:mm:ssZ' }),
    colorize({
      message: true,
    }),
    prettyPrint(),
    printf(({ label, timestamp, message }) => `[${timestamp}] - [PORTAL/API]: ${message}`)
  ),
  transports: [
    new transports.Console({}),
    new transports.File({
      filename: `../logs/APILogs.log`,
      format: uncolorize({}),
      level: 'error',
    }),
  ],
});