import { Controller } from '@l/gas'
import { ControllerTypes } from '@c/controllerTypes'
import { SampleRepository } from '@g/repository/sampleRepository'
import { SpreadsheetSampleModel } from '@c/model/spreadsheetSampleModel'

export const sampleSpreadsheetController: Controller<ControllerTypes, 'sampleSpreadsheet' > = async (args) => {
  const repository = new SampleRepository()
  let result: SpreadsheetSampleModel[] | undefined = undefined
  switch (args?.crud) {
    case 'c':
      if (args.text && args.num) {
        repository.insert({sampleNumber: args.num, sampleText: args.text})
      }
      break
    case 'r':
      if (args.id) {
        const entity = repository.getByRow(args.id)
        result = [{text: entity.sampleText, num: entity.sampleNumber, id: entity.row}]
      }
      break
    case 'u':
      if (args.id && args.text && args.num) {
        repository.update({sampleNumber: args.num, sampleText: args.text, row: args.id})
      }
      break
    case 'd':
      if (args.id) {
        repository.delete(args.id)
      }
      break
  }

  return result ?? repository.getAll().map(it => ({text: it.sampleText, num: it.sampleNumber, id: it.row}))
}