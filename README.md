# VueGas
VueとGasを利用した完全無料Webサービス構築テンプレート

## フォルダ構成 
※: 任意フォルダ・ファイル
- **_lib_**(提供ソース)
  - **common.ts**(共通`import { } from '@l/common'`)
  - **gas.ts**(gas専用`import { } from '@l/gas'`)
  - **vue.ts**(vue専用`import { } from '@l/vue'`)
- **_public_**(distにコピーされるファイル郡)
  - **appsscript.json**(gas設定ファイル `webapp/access` => `MYSELF` or `ANYONE` or `DOMAIN`)
  - **index.html**(vue(client側)基盤ファイル)
- **_src_**
  - **_common_**(gas・vue共通利用ソース)
    - **_model_**※(gas<>vue間で利用するオブジェクトの取り決め)
    - **config.ts**※(gasのスプリプとプロパティで設定した値の取り決め)
    - **controllerTypes.ts**※(gas<>vue間のやり取りの取り決め)
    - **observerTypes.ts**※(gas<>vue間のWebSocketもどきなやり取りの取り決め)
  - **_gas_**(gas専用利用ソース)
    - **_controller_**※(`controllerTypes.ts`で設定したControllerを実装)
    - **_entity_**※(databaseのデータオブジェクト)
    - **_repository_**※(データを操作するClass郡)
    - **_observer_**※(`observerTypes.ts`で設定した変更を検知したタイミングでレスポンスを還すObserverを実装)
    - **main.ts**(初期化処理　globalにcontrollerをセット)
  - **_vue_**(vue専用利用ソース)
    - **_view_**※(vueテンプレート郡)
    - **main.ts**(初期化処理 ルーターをセット)
- **.clasp.json**(push先gasの指定ファイル)
- **.clasp.json.template**(push先gasの指定ファイルの雛形 Copy・Renameして利用)
## 公開手順
1. AppsScriptの設定から、GoogleAppsScriptAPIを許可
2. `npm install`を実行
3. `init-clasp` を実行し、Googleアカウントと紐づける(初回のみ)
4. GoogleDrive上にAppsScriptを用意する
5. `AppsScript > Projectの設定 > スクリプトID` を `.clasp.json > scriptId` に設定する  
  (`.clasp.json.template`をコピーして作成)
6. `AppsScript > Projectの設定 > スクリプト プロパティ`に必要な値を設定  
7. `push-clasp:prod`を実行  
   (開発しながらの場合は `watch` 、Pushのみは `push-clasp` )
## サンプル説明
適時追記
### 画面を作成
- src/vue/SampleVue.vue
- `<script lang="ts" setup>`必須
- script内の変数をtemplate内で利用可能(return不要)
- 他仕様はVueのreferences参照

### ルーティング
- main.ts の initVueにて、ルーティングを設定する
- ルーティングは`@l/vue/router`で行う
- 他仕様はVue-Routerのreferences参照
### GASと通信
- common上にControllerTypesを用意する
- Gas側は、Controllerの用意する。
- 用意したControllerをinitGas(第3引数)で適用する
``` ts
(global, convertController) => {
  global.sample = convertController(sampleController)
  return global
}
```
- Vue側は、gasClientを利用する
  `gasClient.controller<ControllerTypes>().send('').then`
#### Controller
- 型は`Controller<ControllerTypes, ''>`とする

#### Observer

### スクリプトプロパティを利用
- AppsScriptのプロパティに値を設定
- common/config.tsに登録したkey値を設定
  - common, gas, vueの3種のスコープ(commonは両方共通)
  - ConfigTypeを作成
- 利用時は`config.vue or gas<ConfigType>('')`

### 永続的なストレージ(Spreadsheet)を利用する
- テーブル(entity)を作成
  - BaseEntityを継承
- リポジトリーを作成
  - BaseRepositoryを継承
- gasInit.useSpreadsheetDBにリポジトリを登録
- 利用時は、リポジトリのインスタンスを生成する

### 便利機能を利用する
#### Logger
#### throwMsg
#### gas - getEmail
#### gas - sleep
### 追加インストール
- vuetify => マテリアルなVueを作成
- pinia => vue内のデータ共有
## Issue
- unit test
- readme追記