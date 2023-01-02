export interface BaseControllerTypes {
  [name: string]: {
    argType: unknown
    returnType: unknown
  }
}

export interface Logger {
  info: (...data: any[]) => void
  debug: (...data: any[]) => void
  warn: (...data: any[]) => void
  error: (...data: any[]) => void
}
export const throwMsg = (msg: string): never => {
  throw msg
}
