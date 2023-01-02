import { Controller } from '@g/bin/gas'
import { ControllerTypes } from '@c/controllerTypes'

export const sampleController: Controller<ControllerTypes, 'sample'> = async () => {
  return {
    text: 'sample test',
    sample: 114514,
  }
}
