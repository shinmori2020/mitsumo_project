# コーディングルール

MitsuMOアプリのコーディング規約。実装前に必ず確認すること。

---

## 技術スタック

- 言語：React（JSX）
- スタイリング：CSS Modules（.module.css）
- 状態管理：React hooks（useState, useReducer）。外部ライブラリは不要
- Excel出力：SheetJS（xlsx）
- PDF出力：jsPDF等のブラウザ内ライブラリ

## ファイル構成

```
src/
├── components/
│   ├── steps/
│   │   ├── Step1BasicInfo.jsx
│   │   ├── Step2Features.jsx
│   │   ├── Step3Design.jsx
│   │   ├── Step4Options.jsx
│   │   └── Step5Result.jsx
│   ├── ui/
│   │   ├── PillButton.jsx
│   │   ├── ToggleSwitch.jsx
│   │   ├── Slider.jsx
│   │   ├── StepIndicator.jsx
│   │   ├── PriceBar.jsx
│   │   ├── GroupCard.jsx
│   │   └── DropdownSelect.jsx
│   └── export/
│       ├── ExcelExport.jsx
│       ├── PdfExport.jsx
│       ├── TextCopy.jsx
│       └── MailSend.jsx
├── data/
│   └── pricing.js          # 単価データ（skills/pricing/SKILL.mdと完全一致）
├── utils/
│   ├── calculatePrice.js   # 金額計算ユーティリティ
│   └── formatCurrency.js   # 金額フォーマット
├── hooks/
│   └── useEstimate.js      # 見積もり状態管理カスタムフック
├── App.jsx
└── index.jsx
```

## 命名規則

- コンポーネント：PascalCase（例：Step1BasicInfo.jsx）
- ユーティリティ：camelCase（例：calculatePrice.js）
- CSS Modules：camelCase（例：styles.pillButton）
- 定数：UPPER_SNAKE_CASE（例：TAX_RATE）
- キー名：snake_case（例：base_wp, func_form）— skills/pricing/SKILL.md のキー名に準拠

## 単価データ

- src/data/pricing.js に定数として定義
- skills/pricing/SKILL.md の値と完全一致させること
- 金額はすべて数値（number型）で保持。表示時にフォーマット
- 消費税率：定数 TAX_RATE = 0.1

## 金額計算

- 専用のユーティリティ関数（calculatePrice.js）にまとめる
- 計算フロー：選択項目合算 → 納期倍率適用 → 割引適用 → 消費税計算
- 小数点以下は Math.round() で四捨五入
- 金額表示は toLocaleString() で3桁カンマ区切り

## コンポーネント設計

- ステップごとにコンポーネントを分割
- UI部品（PillButton, ToggleSwitch等）は再利用可能なコンポーネントとして分離
- 状態はApp.jsxまたはカスタムフック（useEstimate）で一元管理
- 各ステップコンポーネントはpropsで状態と更新関数を受け取る

## コメント

- 日本語コメント推奨
- 各コンポーネントの冒頭に概要コメント
- 複雑な計算ロジックには説明コメント

## その他

- console.logは本番コードに残さない
- エラーハンドリング：try-catchで出力機能のエラーを処理
- アクセシビリティ：aria-label、role属性を適切に設定
