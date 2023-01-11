import { Controller } from '@l/gas'
import { ControllerTypes } from '@c/controllerTypes'
import { SampleRepository } from '@g/repository/sampleRepository'

export const sampleController: Controller<ControllerTypes, 'sample'> = async () => {
  const repo = new SampleRepository()
  return {
    text: repo.getByRow(2).sampleText,
    sample: 114514,
  }
}
