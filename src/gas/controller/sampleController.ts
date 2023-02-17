import { Controller } from '@l/gas'
import { ControllerTypes } from '@c/controllerTypes'

export const sampleController: Controller<ControllerTypes, 'controllerSample'> = async (args) => {
  if (!args) throw 'サンプルコントローラーでエラーが発生'
  return {
    result: args.num1 + args.num2,
    text: 'result text',
  }
}
