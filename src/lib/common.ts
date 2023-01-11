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

export interface Config {
  debug: boolean
  [key: string]: unknown
}
export const config = <C extends Config>() => {
  return {
    /**
     * config.html内のID['common-config', 'gas-config']のデータを取得する
     */
    gas: <K extends keyof C>(key: Exclude<K, ''>): C[K] => {
      const content = HtmlService.createHtmlOutputFromFile('config').getContent()
      const commonData = Parser.data(content)
        .from('<script type="application/json" id="common-config">')
        .to('</script>')
        .iterate()[0]
      const gasData = Parser.data(content)
        .from('<script type="application/json" id="gas-config">')
        .to('</script>')
        .iterate()[0]
      return Object.assign(JSON.parse(commonData), JSON.parse(gasData))[key]
    },
    /**
     * config.html内のID['common-config', 'vue-config']のデータを取得する
     */
    vue: <K extends keyof C>(key: Exclude<K, ''>): C[K] => {
      const content = document.getElementById('vue-config')?.textContent ?? ''
      return JSON.parse(content)[key]
    },
  }
}
