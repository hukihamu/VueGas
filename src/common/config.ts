export const configKeys = {
  common: ['debug'],
  vue: ['vueConfig'],
  gas: ['spreadsheetId'],
} as const

export type ConfigType = {
  common: typeof configKeys['common'][number]
  vue: typeof configKeys['vue'][number]
  gas: typeof configKeys['gas'][number]
}
