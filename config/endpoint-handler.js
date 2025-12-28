export class Response {
  constructor(body, statusCode) {
    this.body = body
    this.statusCode = statusCode
  }
}

const endpointHandler = fn => async (req, res) => {
  const result = await fn(req, res)

  const response = result instanceof Response ? result : new Response(result, 200)

  res.status(response.statusCode).json(response.body)
}

export default endpointHandler