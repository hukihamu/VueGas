import { BaseRepository, InitEntity } from '@l/gas'
import { SampleEntity } from '@g/entity/sampleEntity'
import { spreadsheetId } from '@g/repository/spreadsheetId'

export class SampleRepository extends BaseRepository<SampleEntity> {
  // spreadsheetId、テーブル名をコンストラクタで設定
  constructor() {
    super(spreadsheetId, 'SAMPLE_TABLE')
  }
  // テーブルバージョン(カラムの変更時に数値を上げる)
  protected readonly tableVersion: number = 2
  // テーブル初期値(テーブル作成更新時、予めデータを入れた状態とする)
  protected readonly initData: InitEntity<SampleEntity>[] = [
    {
      sampleText: 'database sample',
      sampleNumber: 0,
    },
  ]
  // カラムの並び順を指定
  protected readonly columnList: (keyof InitEntity<SampleEntity>)[] = ['sampleText', 'sampleNumber']
}
