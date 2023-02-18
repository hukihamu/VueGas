export interface BaseControllerTypes {
  [name: string]: {
    argType: unknown
    returnType: unknown
  }
}

type BaseObserverTypeArg = {
  // 3分以下
  intervalMSec: number
}
export interface BaseObserverTypes {
  [name: string]: {
    argType: BaseObserverTypeArg
    returnType: unknown
  }
}

export interface Logger {
  info: (label: string, data: any) => void
  debug: (label: string, data: any) => void
  warn: (label: string, data: any) => void
  error: (label: string, data: any) => void
}

type BaseConfig = {
  common: 'debug'
  gas: string
  vue: string
}
export type ConfigKeysType = {
  readonly common: readonly string[]
  readonly gas: readonly string[]
  readonly vue: readonly string[]
}

export const config = {
  /**
   * gasのPropertiesServiceを取得する
   */
  gas: <K extends BaseConfig>(key: Exclude<K['gas'], ''> | K['common']): string | undefined => {
    return PropertiesService.getScriptProperties().getProperty(key) ?? undefined
  },
  /**
   * gasのPropertiesServiceからvue文を抽出した値を取得する
   */
  vue: <K extends BaseConfig>(key: Exclude<K['vue'], ''> | K['common']): string | undefined => {
    const content = document.getElementById('vue-config')?.textContent ?? ''
    return JSON.parse(content)[key]
  },
}
export const throwMsg = (msg: string): never => {
  throw msg
}
