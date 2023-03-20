import winston from "winston";
const { combine, timestamp, printf, colorize, align } = winston.format;

declare global {
  var prismaLogger: winston.Logger | undefined;
}

const getFormatBasedOnNameSpace = (namespace: string) =>
  combine(
    colorize({ all: true }),
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    align(),
    printf(
      (info) =>
        `[${info.timestamp}] ${namespace} ${info.level}: ${info.message}`
    )
  );

export const prismaLogger =
  global.prismaLogger ||
  winston.createLogger({
    format: getFormatBasedOnNameSpace("prisma"),
    transports: [new winston.transports.Console()],
  });

if (process.env.NODE_ENV !== "production") global.prismaLogger = prismaLogger;
