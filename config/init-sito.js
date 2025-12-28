import sito from 'sito'
import { ValidationError } from '../errors/index.js'

sito.interceptor.onError((error, params) => {
  return new ValidationError(error.message, {
    path   : params.path,
    key    : params.key,
    value  : params.value,
    payload: params.payload,
  })
})