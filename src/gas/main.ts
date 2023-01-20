import { initGas } from '@l/gas'
import { sampleController } from '@g/controller/sample'
import { SampleRepository } from '@g/repository/sampleRepository'
import { ControllerTypes } from '@c/controllerTypes'
import { configKeys } from '@c/config'
import { ObserverType } from '@c/observerType'
import { sampleObserver } from '@g/observer/sampleObserver'

initGas<ControllerTypes>('SampleTitle', configKeys, (global, convertController) => {
  global.sample = convertController(sampleController)
  return global
})
  .useSpreadsheetDB(SampleRepository)
  .useObserver<ObserverType>((global, convertObserver) => {
    global.sampleObserver = convertObserver(sampleObserver)
    return global
  })
