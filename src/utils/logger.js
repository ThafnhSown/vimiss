const LogLevels = Object.freeze({
  INFO: "INFO",
  WARN: "WARN",
  DEBUG: "DEBUG",
  ERROR: "ERROR"
})
const env = process.env.NODE_ENV;

/**
 * 
 * @param {string} level 
 * @param {any} [message] 
 * @param  {...any} optionalParams 
 */
function log(level, message, ...optionalParams) {
  if (!message || (env === 'production' && level === LogLevels.DEBUG)) return;
  const _prefix = `[${new Date().toISOString()}] [${LogLevels[level]}]`;
  const _params = [message, ...optionalParams];
  console.log(_prefix, ..._params)
}

/**
 * @typedef {(message?: any, ...optionalParams: any[]) => void} LogFunction
 */

/** @type {Record<"info" | "warn" | "debug" | "error", LogFunction>} */
export default {
  info: (message, ...optionalParams) => log(LogLevels.INFO, message, ...optionalParams),
  warn: (message, ...optionalParams) => log(LogLevels.WARN, message, ...optionalParams),
  debug: (message, ...optionalParams) => log(LogLevels.DEBUG, message, ...optionalParams),
  error: (message, ...optionalParams) => log(LogLevels.ERROR, message, ...optionalParams)
}