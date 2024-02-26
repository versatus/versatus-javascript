import { Logger, ILogObj } from 'tslog'
import { LOG_LEVEL, LogLevel } from './env'

function getLogLevel(logLevel: string | number): number {
  switch (logLevel) {
    case 0: // silly
    case 1: // trace
    case 'silly':
      return LogLevel.silly
    case 2: // debug
    case 'debug':
      return LogLevel.debug
    case 3: // info
    case 'info':
      return LogLevel.info
    case 4: // warn
    case 'warn':
      return LogLevel.warn
    case 5: // error
    case 6: // fatal
    case 'error':
      return LogLevel.error
    default:
      return LogLevel.info
  }
}

const logSettings = {
  displayFunctionName: false,
  displayLoggerName: true,
  displayLogLevel: true,
  displayInstanceName: false,
  displayRequestId: false,
  dateTimePattern: 'year-month-day hour:minute:second.millisecond',
  colorizePrettyLogs: false,
  minLevel: getLogLevel(LOG_LEVEL),
}

class ExtendedLogger extends Logger<ILogObj> {
  dir(obj: any): void {
    console.dir(obj, { depth: null })
  }
}

const log = new ExtendedLogger(logSettings)

export default log
