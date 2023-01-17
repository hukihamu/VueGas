import { initGas } from '@l/gas'
import { sampleController } from '@g/controller/sample'
import { SampleRepository } from '@g/repository/sampleRepository'
import { ControllerTypes } from '@c/controllerTypes'
import { configKeys } from '@c/config'

initGas<ControllerTypes>('SampleTitle', configKeys, (global, convertController) => {
  global.sample = convertController(sampleController)
  return global
}).useSpreadsheetDB(SampleRepository)
