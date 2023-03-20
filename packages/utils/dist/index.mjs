import winston from 'winston';

// src/logger.ts
var { combine, timestamp, printf, colorize, align } = winston.format;
var getFormatBasedOnNameSpace = (namespace) => combine(
  colorize({ all: true }),
  timestamp({
    format: "YYYY-MM-DD hh:mm:ss.SSS A"
  }),
  align(),
  printf(
    (info) => `[${info.timestamp}] ${namespace} ${info.level}: ${info.message}`
  )
);
var prismaLogger = global.prismaLogger || winston.createLogger({
  format: getFormatBasedOnNameSpace("prisma"),
  transports: [new winston.transports.Console()]
});
if (process.env.NODE_ENV !== "production")
  global.prismaLogger = prismaLogger;

export { prismaLogger };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.mjs.map