# tasuku.dev

Tasuku Watanabe の個人サイト。Web 開発、プログラミング、技術的な学びを発信する技術ブログです。

**サイト URL:** https://tasukudev.vercel.app/

## 技術スタック

- **フレームワーク**: [Astro](https://astro.build/) v6 + TypeScript (strict)
- **スタイリング**: [Tailwind CSS](https://tailwindcss.com/) v4 (`@theme` による CSS-first 設定)
- **コンテンツ**: MDX + Astro Content Collections
- **デプロイ**: [Vercel](https://vercel.com/)

## 機能

- ブログ記事（MDX）
- Qiita / Zenn 記事のスクレイピングによる外部コンテンツ集約
- Speaker Deck スライドの一覧表示
- RSS フィード・サイトマップ
- ビジュアルリグレッションテスト (VRT)

## プロジェクト構成

```text
├── public/                   # 静的ファイル (favicon, OG画像など)
├── scripts/                  # スクレイピングスクリプト
│   ├── scrape-qiita.js
│   ├── scrape-zenn.js
│   └── scrape-speakerdeck.js
├── src/
│   ├── components/           # Astro コンポーネント
│   ├── content/blog/         # ブログ記事 (Markdown / MDX)
│   ├── data/                 # スクレイピング結果 (JSON)
│   ├── layouts/              # ページレイアウト
│   ├── pages/                # ルーティング
│   ├── styles/               # グローバル CSS
│   ├── types/                # 共有型定義
│   └── utils/                # ユーティリティ関数
├── vrt/                      # ビジュアルリグレッションテスト
├── astro.config.mjs
└── package.json
```

## コマンド

### 開発・ビルド

| コマンド       | 説明                                |
| :------------- | :---------------------------------- |
| `pnpm install` | 依存関係のインストール              |
| `pnpm dev`     | 開発サーバー起動 (`localhost:4321`) |
| `pnpm build`   | プロダクションビルド (`./dist/`)    |
| `pnpm preview` | ビルド結果のローカルプレビュー      |

### コード品質

| コマンド            | 説明                          |
| :------------------ | :---------------------------- |
| `pnpm type-check`   | TypeScript 型チェック         |
| `pnpm lint`         | Lint (oxlint)                 |
| `pnpm lint:fix`     | Lint 自動修正                 |
| `pnpm format`       | コードフォーマット (Prettier) |
| `pnpm format:check` | フォーマット確認              |

### 外部コンテンツのスクレイピング

| コマンド                  | 説明                                  |
| :------------------------ | :------------------------------------ |
| `pnpm scrape-qiita`       | Qiita 記事を取得し `src/data/` に保存 |
| `pnpm scrape-zenn`        | Zenn 記事を取得し `src/data/` に保存  |
| `pnpm scrape-speakerdeck` | SpeakerDeck スライドを取得し保存      |
| `pnpm scrape-all`         | 上記すべてを順番に実行                |

### ビジュアルリグレッションテスト

```sh
pnpm vrt:before    # 変更前のスクリーンショットを撮影
# ... コードを変更 ...
pnpm vrt:after     # 変更後のスクリーンショットを撮影
pnpm vrt:compare   # 差分を比較
pnpm vrt:update    # before を after で更新（差分確認後）
```

## 開発セットアップ

```sh
pnpm install
pnpm dev
```

コミット前に [lefthook](https://github.com/evilmartians/lefthook) による自動チェックが実行されます（型チェック・Lint・フォーマット確認）。初回セットアップ時は lefthook が自動的にフックを登録します。
