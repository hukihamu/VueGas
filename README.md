# VueGas
VueとGasを利用した完全無料Webサービス構築テンプレート

## フォルダ構成 
※: 任意フォルダ・ファイル
- **_public_**(distにコピーされるファイル郡)
  - **appsscript.json**(gas設定ファイル)
  - **config.html**(システム設定ファイル)
  - **config.html.template**(システム設定ファイルの雛形 Copy・Renameして利用)
  - **index.html**(vue(client側)基盤ファイル)
- **_src_**
  - **_common_**(gas・vue共通利用ソース)
    - **_model_**※(gas<>vue間で利用するオブジェクトの取り決め)
    - **controllerTypes.ts**※(gas<>vue間のやり取りの取り決め)
  - **_gas_**(gas専用利用ソース)
    - **_controller_**※(`controllerTypes.ts`で設定したControllerを実装)
    - **_entity_**※(databaseのデータオブジェクト)
    - **_repository_**※(データを操作するClass郡)
    - **gConfig.ts**※(Configに設定したkeyを取り決め)
    - **main.ts**(初期化処理　globalにcontrollerをセット)
  - **_lib_**(提供ソース)
    - **common.ts**(共通`import { } from '@l/common'`)
    - **gas.ts**(gas専用`import { } from '@l/gas'`)
    - **vue.ts**(vue専用`import { } from '@l/vue'`)
  - **_vue_**(vue専用利用ソース)
    - **_view_**※(vueテンプレート郡)
    - **main.ts**(初期化処理 ルーターをセット)
    - **vConfig.ts**※(Configに設定したkeyを取り決め)
- **.clasp.json**(push先gasの指定ファイル)
- **.clasp.json.template**(push先gasの指定ファイルの雛形 Copy・Renameして利用)
## 公開手順
1. `init-clasp` を実行し、Googleアカウントと紐づける(初回のみ)
2. GoogleDrive上にAppsScriptを用意する
3. `AppsScript > Projectの設定 > スクリプトID` を `.clasp.json > scriptId` に設定する  
  (`.clasp.json.template`をコピーして作成)
4. `AppsScript > Projectの設定 > スクリプト プロパティ`に必要な値を設定  
5. `push-clasp:prod`を実行  
   (開発しながらの場合は `watch` 、Pushのみは `push-clasp` )
## サンプル説明
適時追記

## Issue
- Web Socketもどき案
  - script.runを動かす
  - Socket用ssでフラグを有効化
  - repositoryのcad時でSocket用ss変更
  - 変化があるまでwait(1s)
  - 変化があればreturn
  - 変化がなければtimeout前にreturn
  - 止めるときはSocket用ssのフラグを無効化