# VueGas
VueとGasを利用した完全無料Webサービス構築テンプレート

## フォルダ構成
適時追記
## 公開手順
1. `init:clasp` を実行し、Googleアカウントと紐づける
2. GoogleDrive上にAppsScriptを用意する
3. `AppsScript > Projectの設定 > スクリプトID` を `.clasp.json > scriptId` に設定する  
  (`.clasp.json.template`をコピーして作成)
4. `public/config.html`に必要な値を設定  
  (`config.html.template`をコピーして作成)
5. `push:build`を実行  
   (適時Buildには `watch` 、Pushのみは `push:clasp` )
## サンプル説明
適時追記
## Issue
- [x] config.htmlを3分割(config, gConfig, vConfig)
  - vConfigはhtmlとマージしてvue側で使えるように