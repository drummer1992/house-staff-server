import { asyncStorage } from './async-storage.js'
import compact from 'lodash.compact'

const withBrackets = (value: string) => `[${value}]`

const REQ_ID = Symbol('rid')

type LogLevel = 'info' | 'error'

class Logger {
  private [REQ_ID]?: string

  constructor(props: { reqId?: string } = {}) {
    this[REQ_ID] = props.reqId
  }

  get reqId(): string | undefined {
    return this[REQ_ID]
  }

  print(level: LogLevel, args: unknown[]): void {
    console[level](compact([this.reqId && withBrackets(this.reqId), ...args]).join(' '))
  }
}

const DEFAULT_LOGGER = new Logger()

const getLogger = (): Logger => {
  const store = asyncStorage.getStore()

  if (!store) {
    return DEFAULT_LOGGER
  }

  let logger = store.get('logger') as Logger | undefined

  if (!logger) {
    logger = new Logger({ reqId: store.get('reqId') as string | undefined })

    store.set('logger', logger)
  }

  return logger
}

const logger = {
  info(...args: unknown[]): void {
    return getLogger().print('info', args)
  },
  error(...args: unknown[]): void {
    return getLogger().print('error', args)
  },
}

export default logger
