import { config } from '@l/common'

export const configKeys = {
  common: ['debug', 'spreadsheetId'],
  vue: ['vueConfig'],
  gas: [],
} as const

type ConfigType = {
  common: typeof configKeys['common'][number]
  vue: typeof configKeys['vue'][number]
  gas: typeof configKeys['gas'][number]
}

export const getConfig = {
  vue: (key: Exclude<ConfigType['vue'], ''> | ConfigType['common']) => {
    return config.vue<ConfigType>(key)
  },
  gas: (key: Exclude<ConfigType['gas'], ''> | ConfigType['common']) => {
    return config.gas<ConfigType>(key)
  },
}