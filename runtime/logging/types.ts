export interface LoggingService {
  logError: (errorStringOrObject: string | Error, customAttributes: any) => void,
  logInfo: (infoStringOrErrorObject: string | Error, customAttributes: any) => void,
}
