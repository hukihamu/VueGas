import { Controller, observer } from '@l/gas'
import { ControllerTypes } from '@c/controllerTypes'

export const setConfigController: Controller<ControllerTypes, 'setConfig'> = async (arg) => {
  if (!arg) throw 'setConfigでエラーが発生'
  PropertiesService.getScriptProperties().setProperty(arg.configName, arg.text)
  observer.onUpdateEvent('sampleEvent')
}