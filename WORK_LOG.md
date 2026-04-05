# MitsuMO 作業ログ

## 2026-04-03 セッション1

### 1. Reactプロジェクト初期セットアップ
- Vite + React 19 でプロジェクトを作成
- 追加ライブラリをインストール：`xlsx`（Excel出力）、`jspdf` + `jspdf-autotable`（PDF出力）
- `index.html` を日本語対応（`lang="ja"`、タイトル設定）
- `.gitignore` 作成

### 2. GitHub Pages デプロイ
- GitHubリポジトリ `shinmori2020/mitsumo_project` を作成・接続
- `vite.config.js` に `base: '/mitsumo_project/'` を設定
- GitHub Actions ワークフロー（`.github/workflows/deploy.yml`）を作成
- GitHub Pages の Source を GitHub Actions に設定
- 公開URL: https://shinmori2020.github.io/mitsumo_project/

### 3. Step1「サイトの基本情報」画面の実装
- **データ・ユーティリティ**
  - `src/data/pricing.js` — 全43項目の単価データ
  - `src/utils/calculatePrice.js` — 金額計算ロジック（全ステップ対応）
  - `src/utils/formatCurrency.js` — 3桁カンマ区切りフォーマット
  - `src/hooks/useEstimate.js` — 見積もり状態管理カスタムフック
- **UIコンポーネント**
  - `PillButton` — ピル型選択ボタン
  - `ToggleSwitch` — トグルスイッチ（項目名+補足+トグル）
  - `Slider` — スライダー+数値バッジ
  - `GroupCard` — グループラベル+ボックス
  - `StepIndicator` — 上部ステップインジケーター
  - `PriceBar` — 下部金額バー
- **Step1画面**
  - サイト種類（コーポレート/LP/EC/ブログ）
  - 制作方式（WordPress/HTML・CSS）
  - ページ構成（トップページ、下層ページ、LP）
  - テンプレート（ブログ記事、アーカイブ、404）
  - レスポンシブ対応、データ移行

### 4. サイドバー実装
- 左サイドバーに選択内容サマリーと金額を表示
- ヘッダーに左右切り替えスイッチを追加（デフォルト：左）
- 2カラムレイアウト化（入力エリアの幅を適切に制限）
- 全ステップで過去の選択内容が確認可能

### 5. レイアウト調整
- サイドバーを画面全高（上下いっぱい）に変更
- ヘッダーとPriceBarをメインカラム内に収める
- PriceBarを `fixed` → `sticky` に変更

### 6. デザイン調整
- サイドバー幅: 300px → 380px → 500px
- 金額表示の「(税込)」を金額の右に横並び配置
- 金額カードのテキストを左揃えに変更
- 角丸を全体的に `border-radius: 8px` に統一（トグルのノブ等は除外）
- 余白を全体的に広く調整
- フォントサイズを全体的に約2px引き上げ
- トグルのノブサイズを縮小（22px → 18px、トラックはそのまま）

### 7. デフォルト値の変更
- 全トグルのデフォルトをOFFに変更
- 下層ページ数のデフォルトを0に変更
- 制作方式のデフォルトをHTML・CSSに変更

---

## 現在のプロジェクト構造

```
src/
├── components/
│   ├── steps/
│   │   └── Step1BasicInfo.jsx（+module.css）
│   ├── ui/
│   │   ├── PillButton.jsx（+module.css）
│   │   ├── ToggleSwitch.jsx（+module.css）
│   │   ├── Slider.jsx（+module.css）
│   │   ├── StepIndicator.jsx（+module.css）
│   │   ├── PriceBar.jsx（+module.css）
│   │   ├── GroupCard.jsx（+module.css）
│   │   └── Sidebar.jsx（+module.css）
│   └── export/（未実装）
├── data/
│   └── pricing.js
├── utils/
│   ├── calculatePrice.js
│   └── formatCurrency.js
├── hooks/
│   └── useEstimate.js
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## 残りの作業

### 画面実装
- `/build-step2` — Step2「機能選択」画面
- `/build-step3` — Step3「デザイン仕様」画面
- `/build-step4` — Step4「その他オプション」画面
- `/build-step5` — Step5「見積もり結果」画面

### 出力機能
- `/build-excel-output` — Excel出力
- `/build-pdf-output` — PDF出力
- `/build-export` — テキストコピー・メール送信
