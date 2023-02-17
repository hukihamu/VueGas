import { ControllerTypes } from '@c/controllerTypes'
import { gasClient } from '@l/vue'

async function sendController<T extends keyof ControllerTypes>(
  name: Exclude<T, ''>,
  arg?: ControllerTypes[T]['argType']): Promise<ControllerTypes[T]['returnType']>{
  return gasClient.controller<ControllerTypes>().send(name, arg)
}
export default sendController
