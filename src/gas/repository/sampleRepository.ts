import { BaseRepository, InitEntity } from '@l/gas'
import { SampleEntity } from '@g/entity/sampleEntity'
import { throwMsg } from '@l/common'
import { getConfig } from '@c/config'

export class SampleRepository extends BaseRepository<SampleEntity> {
  constructor() {
    // spreadsheetId
    super(getConfig.gas('spreadsheetId') ?? throwMsg('spreadsheetId not found'), 'SAMPLE_TABLE')
  }
  protected readonly tableVersion: number = 2
  protected readonly initData: InitEntity<SampleEntity>[] = [
    {
      sampleText: 'database sample',
      sampleNumber: 0,
    },
  ]
  protected readonly columnList: (keyof InitEntity<SampleEntity>)[] = ['sampleText', 'sampleNumber']
}
