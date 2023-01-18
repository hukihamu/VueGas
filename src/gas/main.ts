import { initGas, observer } from '@l/gas'
import { sampleController } from '@g/controller/sample'
import { SampleRepository } from '@g/repository/sampleRepository'
import { ControllerTypes } from '@c/controllerTypes'
import { configKeys, ConfigType } from '@c/config'
import { ObserverType } from '@c/observerType'
import { sampleObserver } from '@g/observer/sampleObserver'
import { config, throwMsg } from '@l/common'

initGas<ControllerTypes>('SampleTitle', configKeys, (global, convertController) => {
  global.sample = convertController(sampleController)
  return global
})
  .useSpreadsheetDB(SampleRepository)
  .useObserver<ObserverType>((global, convertObserver) => {
    global.sampleObserver = convertObserver(sampleObserver)
    return global
  })
  .useTrigger((global, createTrigger) => {
    global.onSpreadsheetEdit = createTrigger('onSpreadsheetEdit', () =>{observer.onUpdateEvent('sample')}, triggerBuilder => {
      return triggerBuilder
        .forSpreadsheet(
          SpreadsheetApp.openById(config.gas<ConfigType>('spreadsheetId') ?? throwMsg('spreadsheetId not found'))
        )
        .onEdit()
    })
    return global
  })