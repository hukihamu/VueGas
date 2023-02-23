import { initGas } from '@l/gas'
import { sampleController } from '@g/controller/sampleController'
import { SampleRepository } from '@g/repository/sampleRepository'
import { ControllerTypes } from '@c/controllerTypes'
import { configKeys } from '@c/config'
import { ObserverType } from '@c/observerType'
import { sampleObserver } from '@g/observer/sampleObserver'
import { setConfigController } from '@g/controller/setConfigController'
import { sampleSpreadsheetController } from '@g/controller/sampleSpreadsheetController'

initGas<ControllerTypes>('VueGasSample', configKeys, (global, convertController) => {
  global.controllerSample = convertController(sampleController)
  global.setConfig = convertController(setConfigController)
  global.sampleSpreadsheet = convertController(sampleSpreadsheetController)
  return global
})
  .useSpreadsheetDB(SampleRepository)
  .useObserver<ObserverType>((global, convertObserver) => {
    global.observerSample = convertObserver(sampleObserver)
    return global
  })
