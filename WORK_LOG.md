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
  - 制作方式（WordPress/HTML・CSS）— デフォルトはHTML・CSS
  - ページ構成（トップページ、下層ページ、LP）
  - テンプレート（ブログ記事、アーカイブ、404）
  - レスポンシブ対応、データ移行

### 4. サイドバー実装
- 左サイドバーに選択内容サマリーと金額を表示
- ヘッダーに左右切り替えスイッチを追加（デフォルト：左）
- 2カラムレイアウト化（入力エリアの幅を適切に制限）
- 全ステップで過去の選択内容が確認可能
- サイドバー左右切り替え時のスライドアニメーション（サイドバーがメインの手前を通る）

### 5. レイアウト・デザイン調整
- サイドバーを画面全高に、ヘッダーとPriceBarをメインカラム内に収める
- サイドバー幅: 500px
- 金額表示の「(税込)」を金額の右に横並び配置、左揃え
- 角丸を全体的に `border-radius: 8px` に統一（トグルのノブ等は除外）
- 余白を全体的に広く調整
- フォントサイズを全体的に約2px引き上げ
- トグルのノブサイズ縮小（22px → 18px）
- 全トグルのデフォルトをOFF、制作方式のデフォルトをHTML・CSSに変更
- スクロールバーをグリーンテーマに統一

### 6. レスポンシブ対応
- 1024px以下：サイドバー非表示、1カラムレイアウト
- 768px以下：パディング・フォント縮小
- 480px以下：スライダー折り返し、PriceBar縦並び
- ハンバーガーメニュー（≡ ⇄ ✕ アニメーション）でモバイルサイドバーをオーバーレイ表示
- ハンバーガーボタンはオーバーレイの手前（position: fixed, z-index: 300）

---

## 2026-04-07 セッション2

### 7. Step2「機能選択」画面の実装
- 5グループ構成：基本機能(6) / UIパーツ(4) / 外部連携(2) / WordPress固有(3) / EC関連(3)
- WordPress固有：制作方式がWordPressの時のみ表示
- EC関連：サイト種類がECの時のみ有効、それ以外は案内文表示
- アニメーション：ドロップダウンで排他選択（なし/シンプル/リッチ）
- `DropdownSelect` UIコンポーネントを新規作成

### 8. Step3「デザイン仕様」画面の実装
- 配色テーマ：カラースウォッチカード×3（HTML5 color picker）
- フォントの雰囲気：ピル型選択（やわらかい/シャープ/フォーマル/カジュアル）
- レイアウトイメージ：2×2グリッド、SVGプレビュー付き
- 参考サイトURL×2、その他の要望テキストエリア
- 金額に影響しない（Excel Sheet2に反映）
- サイドバーにStep3サマリー追加（色スウォッチ・フォント・レイアウト表示）

### 9. Step4「その他オプション」画面の実装
- 最適化・設定グループ（トグル×6）
- 納品関連グループ（トグル×4）
- 保守プラン（ドロップダウン：なし/ライト/スタンダード）
- 納期（ドロップダウン：通常/急ぎ×1.3/特急×1.5）
- 割引（ピル選択：なし/値引き額/割引率 + 条件入力）
- 見積もりヘッダー情報（お客様名・納期の希望）
- 備考情報（修正回数・支払い・その他）
- ボタンは「戻る」と「結果を見る」

### 10. Step5「見積もり結果」画面の実装
- 合計金額カード（お客様名・税込金額40px・税抜/消費税/割引表示）
- 保守プラン月額を別途表示
- 有効期限（本日〜30日後を自動計算）
- 内訳テーブル（トグルで表示/非表示、ON項目のみ、偶数行色付き）
- 集計行（小計/納期調整/割引/消費税/合計）
- 出力ボタン（Excel/PDF/テキストコピー/メール）
- 「内容を修正する」→Step4 /「新しい見積もり」→リセット+確認ダイアログ
- Step5ではPriceBar非表示

### 11. 出力機能の実装
- **Excel出力**（xlsx-js-style）
  - 3シート構成：見積もり明細 / サイト仕様 / 備考・補足事項
  - セルスタイル付き：背景色・罫線・フォントサイズ・セル結合・行の高さ
  - グリーンヘッダー、偶数行パステル背景、ダークグリーン合計行
- **PDF出力**（html2canvas + jsPDF）
  - 日本語完全対応（ブラウザレンダリング方式）
  - 複数ページ分割対応（内容量に応じてページ自動追加）
  - 見積もり明細 / サイト仕様 / 備考を1つのPDFに
- **テキストコピー**（Clipboard API）
  - 見積もり概要をテキスト形式でクリップボードにコピー
  - フォールバック対応（execCommand）
- **メール送信**（mailto:リンク）
  - 件名と本文に見積もり内容を自動挿入

### 12. UX改善
- ステップ切り替え時にスムーズスクロールで先頭に戻る
- PDF出力時「PDF生成中...」表示＋ボタン無効化（連打防止）
- 完了済みステップのインジケーターをクリックで遷移可能（ホバーエフェクト付き）
- 内訳テーブルの集計行ボーダーを細く薄く調整

---

## 現在のプロジェクト構造

```
src/
├── components/
│   ├── steps/
│   │   ├── Step1BasicInfo.jsx（+module.css）
│   │   ├── Step2Features.jsx（+module.css）
│   │   ├── Step3Design.jsx（+module.css）
│   │   ├── Step4Options.jsx（+module.css）
│   │   └── Step5Result.jsx（+module.css）
│   ├── ui/
│   │   ├── PillButton.jsx（+module.css）
│   │   ├── ToggleSwitch.jsx（+module.css）
│   │   ├── Slider.jsx（+module.css）
│   │   ├── DropdownSelect.jsx（+module.css）
│   │   ├── StepIndicator.jsx（+module.css）
│   │   ├── PriceBar.jsx（+module.css）
│   │   ├── GroupCard.jsx（+module.css）
│   │   └── Sidebar.jsx（+module.css）
│   └── export/
│       ├── ExcelExport.jsx
│       ├── PdfExport.jsx
│       ├── TextCopy.jsx
│       └── MailSend.jsx
├── data/
│   └── pricing.js
├── utils/
│   ├── calculatePrice.js
│   ├── formatCurrency.js
│   └── buildBreakdown.js
├── hooks/
│   └── useEstimate.js
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## 主要ライブラリ

| ライブラリ | 用途 |
|---|---|
| React 19 | UIフレームワーク |
| Vite | ビルドツール |
| xlsx-js-style | Excel出力（スタイル付き） |
| jsPDF | PDF生成 |
| html2canvas | HTML→Canvas変換（PDF用） |

## 今後の改善候補

- LocalStorage保存（ブラウザ閉じても入力データ保持）
- ファビコン変更（Viteデフォルト→MitsuMOロゴ）
- 「すべてON/OFF」一括操作ボタン（Step2/4）
- 印刷用スタイルシート
- 見積もり履歴（LocalStorage保存・一覧・呼び出し）
