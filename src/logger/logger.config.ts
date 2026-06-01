import type { Params } from 'nestjs-pino'
import { randomCode } from '../utils/random.js'

export const loggerConfig = (env?: string, logLevel?: string): Params => {
  const isProd = env === 'production'

  return ({
    pinoHttp: {
      level: logLevel ?? (isProd ? 'info' : 'debug'),

      genReqId: (req, res) => {
        const id = randomCode(4)

        res.setHeader('x-request-id', id)

        return id
      },

      redact: {
        paths : ['req.headers.authorization', 'req.headers.cookie', 'req.body.password'],
        remove: true,
      },

      serializers: {
        req: req => ({ id: req.id, method: req.method, url: req.url }),
        res: res => ({ statusCode: res.statusCode }),
      },

      transport: isProd
        ? undefined
        : { target: 'pino-pretty', options: { singleLine: true, translateTime: 'SYS:standard' } },
    },
  })
}