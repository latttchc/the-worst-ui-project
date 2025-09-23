# FROZEN LOVE (かき氷注文システム)

🍧 **技育祭 特別企画** 🥶  
**『かき氷注文システムのUIを最凶にせよ！？』**

## 受賞 🏆
### 🎉本プロジェクトでラムダ技術部賞　ロッシー賞を受賞しました🎉

---

## 概要

このプロジェクトは、かき氷注文システムのUIをテーマにしたハッカソンのフロントエンドアプリケーションです。  
ユーザーは店舗ごとのかき氷メニューから注文したいものを選び、マッチング形式で注文体験を楽しめます。

- URL：https://frozen-love.vercel.app/
- X：https://x.com/geek_pjt/status/1970409978281480251

---

## 主な機能

- 店舗ごとのかき氷メニュー取得・表示
- マッチングUIによる注文体験（Tinder風スワイプUI）
- 注文メニューの選択・送信
- チャット風の注文確認・会話体験
- 注文完了後のレシート表示
- エラー・ローディング表示
- レスポンシブデザイン対応

---

## 開発環境

- [Next.js](https://nextjs.org/) (App Router)
- TypeScript
- React
- class-variance-authority
- Lucide Icons
- Storybook（UIコンポーネント開発用）
- Vitest（テスト用）

---

## セットアップ

1. リポジトリをクローン
2. 必要なパッケージをインストール

```bash
npm install
```

3. `.env`ファイルを作成  
   プロジェクトルートに`.env`ファイルを作成し、必要な環境変数を設定してください。  
   サンプルとして`.env.example`を用意しています。

```
NEXT_PUBLIC_API_BASE=
NEXT_PUBLIC_STORE_ID=
```

4. 開発サーバーを起動

```bash
npm run dev
```

5. ブラウザで [http://localhost:3000](http://localhost:3000) を開いて動作を確認

---

## ディレクトリ構成

```
.
├── src/
│   ├── app/                # Next.js App Router 構成
│   │   ├── order/          # 注文フロー
│   │   │   └── [storeId]/
│   │   │       ├── match/  # マッチングUI
│   │   │       ├── message/# チャットUI
│   │   │       └── receipt/# レシート表示
│   ├── components/         # UIコンポーネント
│   ├── constants/          # 定数（会話フロー等）
│   ├── api/                # APIクライアント
│   └── types/              # 型定義
├── public/                 # 画像・静的ファイル
├── .env.example            # 環境変数サンプル
├── README.md
└── ...
```

---

## 主要なファイル・ディレクトリ

- [`src/app/order/[storeId]/match/page.tsx`](src/app/order/[storeId]/match/page.tsx)  
  マッチングUIのメインページ
- [`src/app/order/[storeId]/message/message-content.tsx`](src/app/order/[storeId]/message/message-content.tsx)  
  チャット形式の注文確認ページ
- [`src/app/order/[storeId]/receipt/[orderId]/receipt-content.tsx`](src/app/order/[storeId]/receipt/[orderId]/receipt-content.tsx)  
  注文完了・レシート表示
- [`src/constants/conversationFlow.ts`](src/constants/conversationFlow.ts)  
  チャットボットの会話フロー定義
- [`src/api/api.ts`](src/api/api.ts)  
  APIクライアント

---

## テスト

ユニットテスト・統合テストは [Vitest](https://vitest.dev/) で実行できます。

```bash
# ユニットテスト
npm test

# API統合テスト
npm run test:api

# Storybook（UIテスト）
npm run storybook
```

---

## 環境変数

- `NEXT_PUBLIC_API_BASE` ... APIサーバーのベースURL
- `NEXT_PUBLIC_STORE_ID` ... デフォルトの店舗ID

`.env.example` を参考に `.env` を作成してください。

---

## 補足ドキュメント

- [API使用方法ガイド](API_USAGE.md)

---

## ライセンス

このプロジェクトのライセンスについては後日
