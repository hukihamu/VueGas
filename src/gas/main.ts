import { initGas } from '@g/bin/gas'
import { sampleController } from '@g/controller/sample'
import { SampleRepository } from '@g/repository/sampleRepository'
import { ControllerTypes } from '@c/controllerTypes'

initGas<ControllerTypes>('SampleTitle', { sample: sampleController }).useSpreadsheetDB(SampleRepository)
