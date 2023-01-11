import { BaseRepository, InitEntity } from '@g/bin/gas'
import { SampleEntity } from '@g/entity/sampleEntity'
import { config } from '@c/bin/common'
import { GConfig } from '@g/gConfig'

export class SampleRepository extends BaseRepository<SampleEntity> {
  constructor() {
    // spreadsheetId
    super(config<GConfig>().gas('spreadsheetId'), 'SAMPLE_TABLE')
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
