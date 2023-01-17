import { BaseRepository, InitEntity } from '@l/gas'
import { SampleEntity } from '@g/entity/sampleEntity'
import { config, throwMsg } from '@l/common'
import { ConfigType } from '@c/config'

export class SampleRepository extends BaseRepository<SampleEntity> {
  constructor() {
    // spreadsheetId
    super(config.gas<ConfigType>('spreadsheetId') ?? throwMsg('spreadsheetId not found'), 'SAMPLE_TABLE')
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
