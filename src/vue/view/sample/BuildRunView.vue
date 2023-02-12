<script lang="ts" setup>
import {} from 'vue'

</script>

<template>
  <v-card>
    <v-card-title>ビルド・接続</v-card-title>
    <v-card-text>
      <div class="text-h6 font-weight-bold">
        前準備
      </div>
      <div class="font-weight-medium">
        GoogleDrive上にAppsScriptを用意
      </div>
      <div class="font-weight-medium">
        <code class="v-code">AppsScript > home > 設定 > Google Apps Script API</code>を有効
      </div>
      <div class="font-weight-medium">
        本プロジェクトファイルを用意
      </div>
      <div class="font-weight-medium">
        <code class="v-code">AppsScript > Projectの設定 > スクリプトID</code>を取得し、
        <code class="v-code">.clasp.json > scriptId</code>に設定する。(.clasp.json.templateをコピーして作成)
      </div>
      <div class="font-weight-medium">
        <code class="v-code">npm install</code>を実行
      </div>
      <div class="font-weight-medium">
        <code class="v-code">npm run init-clasp</code>を実行し、AppsScriptを作成したGoogleと紐づける
      </div>
      <v-divider />
      <div class="text-h6 font-weight-bold">
        ビルド
      </div>
      <div class="text-h7 font-weight-bold">
        watchを利用
      </div>
      <div class="font-weight-medium">
        <code class="v-code">watch</code>を実行
      </div>
      <div class="font-weight-medium">
        <code class="v-code">push-clasp</code>を実行してAppsScriptへプッシュする
      </div>
      <div class="text-h7 font-weight-bold">
        直接buildしてprodをプッシュ
      </div>
      <div class="font-weight-medium">
        <code class="v-code">push-clasp:build-prod</code>を実行
      </div>
      <v-divider />
      <div class="text-h6 font-weight-bold">
        接続
      </div>
      <div class="font-weight-medium">
        <code class="v-code">AppsScript > Projectの設定 > スクリプト プロパティ</code>にsrc内のconfigで指定した値を設定
      </div>
      <div class="font-weight-medium">
        <code class="v-code">AppsScript > デプロイ</code>からURLを取得
      </div>
      <div class="font-weight-medium">
        テストの場合<code class="v-code">デプロイをテスト</code>を選択
      </div>
      <div class="font-weight-medium">
        デプロイを作成する場合、種類は<code class="v-code">ウェブアプリ</code>とする
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>

</style>