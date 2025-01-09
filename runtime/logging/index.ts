export {
  configureLogging,
  getLoggingService,
  logError,
  logInfo,
  resetLoggingService
} from './interface';
export { default as MockLoggingService } from './MockLoggingService';
export { default as NewRelicLoggingService } from './NewRelicLoggingService';
