import { BaseRepository } from '@g/bin/gas'
import { SampleEntity } from '@g/entity/sampleEntity'

export class SampleRepository extends BaseRepository<SampleEntity> {
  constructor() {
    super('SAMPLE_TABLE')
  }
  protected readonly columnList: (keyof SampleEntity)[] = ['row', 'sampleText', 'sampleNumber']
  protected readonly tableVersion: number = 1
}
