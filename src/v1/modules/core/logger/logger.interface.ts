export interface ILogger {
  debug(context: string, message: string | object): void;
  log(context: string, message: string | object): void;
  error(context: string, message: string | object, trace?: string): void;
  warn(context: string, message: string | object): void;
  verbose(context: string, message: string | object): void;
}
