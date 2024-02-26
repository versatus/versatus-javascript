import dotenv from 'dotenv'
dotenv.config()

import { parseEnv, z } from 'znv'

export enum LogLevel {
  silly = 0,
  trace = 1,
  debug = 2,
  info = 3,
  warn = 4,
  error = 5,
  fatal = 6,
}

/**
 * ZNV doesn't support ZodUnion types, so we have to do this manually
 */
let logLevel: LogLevel
if (
  process.env.LOG_LEVEL &&
  LogLevel[process.env.LOG_LEVEL.toLowerCase() as keyof typeof LogLevel] !==
    undefined
) {
  logLevel =
    LogLevel[process.env.LOG_LEVEL.toLowerCase() as keyof typeof LogLevel]
} else if (!isNaN(Number(process.env.LOG_LEVEL))) {
  logLevel = Number(process.env.LOG_LEVEL) as LogLevel
} else {
  logLevel = LogLevel.warn // default value
}

export const LOG_LEVEL = logLevel

// Define and validate new environment variables
export const {
  THIS,
  ZERO_VALUE,
  LASR_RPC_URL,
  VIPFS_ADDRESS,
  ETH_PROGRAM_ADDRESS,
  VERSE_PROGRAM_ADDRESS,
  RPC_URL,
} = parseEnv(process.env, {
  THIS: z.string().min(1),
  ZERO_VALUE: z.string().min(1),
  LASR_RPC_URL: z.string().min(1),
  VIPFS_ADDRESS: z.string().min(1),
  ETH_PROGRAM_ADDRESS: z.string().min(1),
  VERSE_PROGRAM_ADDRESS: z.string().min(1),
  RPC_URL: z.string().min(1),
})
