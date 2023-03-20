import winston from 'winston';

declare global {
    var prismaLogger: winston.Logger | undefined;
}
declare const prismaLogger: winston.Logger;

export { prismaLogger };
