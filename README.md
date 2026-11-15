# 投資・AI週間レビュー保存庫

iPhoneのSafariを主対象にした、依存ライブラリなしの静的Webアプリです。ログイン・サーバー・有料API・月額契約は不要です。他の端末でも表示できます。

## GitHub Pagesで無料公開（iPhoneから可能）

1. GitHubにログインし、**新しいPublicリポジトリ** `invest-ai-weekly-vault` を作成します。既存プロジェクトは使いません。無料プランでは公開リポジトリを使います。
2. このフォルダ内の `index.html`、`style.css`、`app.js`、`core.js`、`sw.js`、`manifest.webmanifest`、`icon.png`、`icon-512.png` をリポジトリ直下へアップロードし、コミットします。iPhoneではZIPを「ファイル」で展開し、GitHubの「Add file → Upload files」を利用します。
3. リポジトリの **Settings → Pages → Build and deployment** で **Deploy from a branch / main / (root)** を選び、Saveします。
4. 数分後、Pages画面に表示される `https://ユーザー名.github.io/invest-ai-weekly-vault/` をSafariで開きます。
5. Safariの共有ボタン → **ホーム画面に追加** を選択します。以後はホーム画面から開くと保存領域を統一できます。

代わりに、全ファイル（testsと.githubを含む）をGitでpushして、PagesのSourceを **GitHub Actions** にすると、同梱ワークフローでテスト後に公開できます。

```sh
git remote add origin https://github.com/YOUR_NAME/invest-ai-weekly-vault.git
git push -u origin main
```

公開されるのはアプリのコードです。入力した記事はGitHubへ送信されません。記事やバックアップJSONはリポジトリにアップロードしないでください。

## 保存とバックアップ

- データはブラウザのlocalStorage（キー `weekly-review-v1`）に保存します。本文はプレーンテキスト・Markdownで保持します。
- サイトデータ削除、端末故障、ブラウザによる削除などで消失する可能性があります。永続保存の保証はありません。プライベートブラウズは使用しないでください。
- Safari、ホーム画面、別端末、異なる公開URLでは保存領域が異なる場合があります。自動同期しません。
- 毎回の追加・編集後に「JSONバックアップ」を押し、iCloud Drive等の「ファイル」に保存されたことを確認してください。JSONは暗号化されません。
- 「復元」でJSONを選択します。既存記事は残し、同じIDは更新日時の新しい方を採用します。削除した記事もバックアップから復活する場合があります。
- 保存容量不足時はエラーを表示し、既存記事を維持します。バックアップ後に不要記事を削除してください。
- 初回オンラインアクセスでService Workerを登録します。キャッシュ完了後は同じURLでオフライン利用できます。更新時は `sw.js` のCACHE名を変更してください。

## 書式

Markdownの見出し、太字、表、箇条書き、引用、コードブロックに対応。表とコードは横スクロール。HTMLは実行せず文字として表示します。画像やリッチテキストの貼り付け、複雑な入れ子、Mermaidの描画には対応していません。テキスト図解はコードブロックで囲むと配置を保持できます。

## 検証

Node.js 22以上で `npm test`。保存、再読み込み、編集、削除、検索、バックアップ復元、衝突、不正JSON、容量エラー、HTML無害化をテストします。ブラウザ操作ツールがないためiPhone実機とUIの自動操作は未検証です。

実機では、ホーム画面から起動し、レビューを保存→終了・再起動→編集→JSONをファイルに保存→記事を削除→JSONで復元を確認してください。機内モードでの起動、横長表、キーボード表示中の入力も確認してください。
