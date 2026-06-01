import type { Request, Response as ExpressResponse, RequestHandler } from 'express'

export class Response {
  body: unknown
  statusCode: number

  constructor(body: unknown, statusCode: number) {
    this.body = body
    this.statusCode = statusCode
  }
}

type Handler = (req: Request, res: ExpressResponse) => unknown | Promise<unknown>

const endpointHandler = (fn: Handler): RequestHandler => async (req, res) => {
  const result = await fn(req, res)

  const response = result instanceof Response ? result : new Response(result, 200)

  res.status(response.statusCode).json(response.body)
}

export default endpointHandler
