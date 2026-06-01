import sito from 'sito'
import { ValidationError } from '../errors/index.js'

sito.interceptor.onError((error, params) => {
  return new ValidationError(error.message, {
    path   : params.path || undefined,
    key    : params.key || undefined,
    value  : params.value,
    payload: params.payload,
  })
})
