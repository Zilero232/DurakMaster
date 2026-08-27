import type { Params } from 'nestjs-pino';

const REDACTED = ['req.headers.authorization', 'req.headers.cookie'];

const IGNORED_PATHS = new Set(['/health']);

const prettyOptions = {
  colorize: true,
  colorizeObjects: false,
  singleLine: true,
  translateTime: 'HH:MM:ss',
  ignore: 'pid,hostname,context,req,res,responseTime',
  messageFormat: '{if context}[{context}] {end}{msg}'
};

export const loggerOptions = (isDevelopment: boolean): Params => ({
  pinoHttp: {
    level: isDevelopment ? 'debug' : 'info',
    redact: { paths: REDACTED, censor: '[redacted]' },

    transport: isDevelopment ? { target: 'pino-pretty', options: prettyOptions } : undefined,

    autoLogging: { ignore: (request) => IGNORED_PATHS.has(request.url ?? '') },

    customSuccessMessage: (request, response, responseTime) =>
      `${request.method} ${request.url} ${response.statusCode} ${responseTime}ms`,

    customErrorMessage: (request, response) =>
      `${request.method} ${request.url} ${response.statusCode}`,

    serializers: {
      req: () => undefined,
      res: () => undefined
    }
  }
});
