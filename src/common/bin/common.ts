export interface BaseControllerTypes {
  [name: string]: {
    argType: unknown
    returnType: unknown
  }
}

export interface Logger {
  info: (label: string, data: any) => void
  debug: (label: string, data: any) => void
  warn: (label: string, data: any) => void
  error: (label: string, data: any) => void
}
export const throwMsg = (msg: string): never => {
  throw msg
}
