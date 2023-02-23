<script lang="ts" setup>
import {ref} from 'vue'
import sendController from '@v/util/sendController'
import { SpreadsheetSampleModel } from '@c/model/spreadsheetSampleModel'
import { getConfig } from '@c/config'
const entitySample = `// /src/gas/entity/sampleEntity.ts
import { BaseEntity } from '@l/gas'

export interface SampleEntity extends BaseEntity {
  sampleText: string
  sampleNumber: number
}
`
const sampleRepository = `// /src/gas/repository/sampleRepository.ts
import { BaseRepository, InitEntity } from '@l/gas'
import { SampleEntity } from '@g/entity/sampleEntity'
import { spreadsheetId } from '@g/repository/spreadsheetId'

export class SampleRepository extends BaseRepository&lt;SampleEntity> {
  // spreadsheetId、テーブル名をコンストラクタで設定
  constructor() {
    super(spreadsheetId, 'SAMPLE_TABLE')
  }
  // テーブルバージョン(カラムの変更時に数値を上げる)
  protected readonly tableVersion: number = 2
  // テーブル初期値(テーブル作成更新時、予めデータを入れた状態とする)
  protected readonly initData: InitEntity&lt;SampleEntity>[] = [
    {
      sampleText: 'database sample',
      sampleNumber: 0,
    },
  ]
  // カラムの並び順を指定
  protected readonly columnList: (keyof InitEntity&lt;SampleEntity>)[] = ['sampleText', 'sampleNumber']
}
`.replaceAll('&lt;', '<')
const sampleMain = `/src/gas/main.ts
initGas(/*省略*/)
  .useSpreadsheetDB(SampleRepository)
`
const sampleCreate = `repository.insert({sampleNumber: args.num, sampleText: args.text})`
const sampleRead = `repository.getByRow(args.id)
repository.getAll()
`
const sampleUpdate = `repository.update({sampleNumber: args.num, sampleText: args.text, row: args.id})`
const sampleDelete = `repository.delete(args.id)`
type VueModel = SpreadsheetSampleModel & {isEdit: boolean, editText: string, editNum: number}
const modelTo = (m: SpreadsheetSampleModel[]): VueModel[] => {
  return m.map(it => Object.assign(it, {
    isEdit: false,
    editNum: it.num,
    editText: it.text
  }))
}
const sampleList = ref<VueModel[]>([])
const onRead = () => {
  sendController('sampleSpreadsheet', {crud: 'r'})
    .then(it => sampleList.value = modelTo(it))
}
onRead()
const createNum = ref<number>()
const createText = ref<string>()
const onCreate = () => {
  if (createText.value && createNum.value){
    isLoading.value = true
    sendController('sampleSpreadsheet', {crud: 'c', num: createNum.value, text: createText.value})
      .then(it => {
        sampleList.value = modelTo(it)
        createNum.value = undefined
        createText.value = undefined
        isLoading.value = false
      })
  }
}
const onToggleUpdate = (i: number) => {
  sampleList.value[i].isEdit = !sampleList.value[i].isEdit
}
const onUpdate = (i: number) => {
  isLoading.value = true
  const it = sampleList.value[i]
  sendController('sampleSpreadsheet', {crud: 'u',id: it.id, num: it.editNum, text: it.editText})
    .then(it => {
      sampleList.value = modelTo(it)
      isLoading.value = false
    })
}
const onDelete = (i: number) => {
  isLoading.value = true
  sendController('sampleSpreadsheet', {crud: 'd', id: sampleList.value[i].id})
    .then(it => {
      sampleList.value = modelTo(it)
      isLoading.value = false
    })
}
const isLoading = ref(false)
</script>

<template>
  <v-card>
    <v-card-title>Spreadsheet利用</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item>
          <v-list-item-title>
            スプレッドシートを擬似的なDBとして利用可能<br>
            テーブルの作成更新、CRUD、排他処理が可能
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            動作確認:
            <v-container fluid>
              <v-row>
                <v-col cols="auto" align-self="center">
                  <a target="_blank" :href="'https://docs.google.com/spreadsheets/d/' + getConfig.vue('spreadsheetId')">スプレッドシート</a>
                </v-col>
              </v-row>
              <v-row align="stretch" justify="center">
                <v-col align-self="center">
                  <v-text-field v-model="createText" :loading="isLoading" />
                </v-col>
                <v-col cols="auto" align-self="center">
                  -
                </v-col>
                <v-col align-self="center">
                  <v-text-field v-model.number="createNum" type="number" :loading="isLoading" />
                </v-col>
                <v-col cols="auto" align-self="center">
                  <v-btn :loading="isLoading" @click="onCreate">
                    追加
                  </v-btn>
                </v-col>
                <v-col cols="auto" align-self="center">
                  <v-btn :loading="isLoading" @click="onRead">
                    リロード
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-container fluid class="rounded-0">
                  <v-row v-for="(ss, i) of sampleList" :key="ss.id">
                    <template v-if="ss.isEdit">
                      <v-col align-self="center">
                        <v-text-field v-model="ss.editText" :loading="isLoading" />
                      </v-col>
                      <v-col cols="auto" align-self="center">
                        -
                      </v-col>
                      <v-col align-self="center">
                        <v-text-field v-model.number="ss.editNum" type="number" :loading="isLoading" />
                      </v-col>
                      <v-col cols="auto" align-self="center">
                        <v-btn :loading="isLoading" @click="onUpdate(i)">
                          適用
                        </v-btn>
                      </v-col>
                      <v-col cols="auto" align-self="center">
                        <v-btn :loading="isLoading" @click="onToggleUpdate(i)">
                          キャンセル
                        </v-btn>
                      </v-col>
                    </template>
                    <template v-else>
                      <v-col align-self="center">
                        {{ ss.text }}
                      </v-col>
                      <v-col cols="auto" align-self="center">
                        -
                      </v-col>
                      <v-col align-self="center">
                        {{ ss.num }}
                      </v-col>
                      <v-col cols="auto" align-self="center">
                        <v-btn :loading="isLoading" @click="onToggleUpdate(i)">
                          更新
                        </v-btn>
                      </v-col>
                      <v-col cols="auto" align-self="center">
                        <v-btn :loading="isLoading" @click="onDelete(i)">
                          削除
                        </v-btn>
                      </v-col>
                    </template>
                  </v-row>
                </v-container>
              </v-row>
            </v-container>
          </v-list-item-title>
        </v-list-item>
        <v-list-subheader>
          Entity作成
        </v-list-subheader>
        <v-list-item>
          <v-list-item-title>
            <code class="v-code">BaseEntity</code>を実装したInterfaceを作成する<br>
            一意のID<code class="v-code">row</code>が自動で付与される<br>
            参考:
            <v-code class="code">
              {{ entitySample }}
            </v-code>
          </v-list-item-title>
        </v-list-item>
        <v-list-subheader>
          Repository作成
        </v-list-subheader>
        <v-list-item>
          <v-list-item-title>
            <code class="v-code">BaseRepository</code>を実装したClassを作成する<br>
            参考:
            <v-code class="code">
              {{ sampleRepository }}
            </v-code>
          </v-list-item-title>
        </v-list-item>
        <v-list-subheader>
          gasMainに登録
        </v-list-subheader>
        <v-list-item>
          <v-list-item-title>
            <code class="v-code">useSpreadsheetDB</code>を追加する<br>
            参考:
            <v-code class="code">
              {{ sampleMain }}
            </v-code>
          </v-list-item-title>
        </v-list-item>
        <v-list-subheader>
          SpreadsheetDB利用
        </v-list-subheader>
        <v-list-item>
          <v-list-item-title>
            Create
            <v-code class="code">
              {{ sampleCreate }}
            </v-code>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            Read
            <v-code class="code">
              {{ sampleRead }}
            </v-code>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            Update
            <v-code class="code">
              {{ sampleUpdate }}
            </v-code>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            Delete
            <v-code class="code">
              {{ sampleDelete }}
            </v-code>
          </v-list-item-title>
        </v-list-item>
        <v-list-subheader>
          テーブル更新
        </v-list-subheader>
        <v-list-item>
          <v-list-item-title>
            Repository内のtableVersionを更新する<br>
            デプロイ後の初回起動時に旧テーブルをバックアップし、テーブルを更新する
          </v-list-item-title>
        </v-list-item>
        <v-list-subheader>
          排他処理
        </v-list-subheader>
        <v-list-item>
          <v-list-item-title>
            <code class="v-code">repository.lockType</code>で排他するスコープを変更する<br>
            <code class="v-code">repository.lockWaitMSec</code>で解除されるまで待機するミリ秒を設定する(gasのスクリプトタイムアウトの5分未満に設定)
          </v-list-item-title>
          <v-list-item-subtitle>
            user: ユーザ単位で排他処理(同一ユーザが同時に操作させない)
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            script: リポジトリのスクリプト単位で排他処理(別のユーザでも同じスクリプトを実行している場合、ロックする)
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            none: 排他処理を行わない
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.code {
  white-space: pre-wrap;
}
</style>