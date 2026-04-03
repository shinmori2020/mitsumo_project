# PDF出力機能 実装指示

このコマンドを実行する前に、必ず以下を参照すること：
- skills/excel-spec/SKILL.md（出力内容はExcelと同様の構成）

---

## 概要

ブラウザ内のPDF生成ライブラリを使って、見積書PDFを生成・ダウンロードさせる。

## 実装するコンポーネント

`src/components/export/PdfExport.jsx`

## ライブラリ選択肢

- jsPDF + jspdf-autotable（テーブル生成が楽）
- またはhtml2canvas + jsPDF（HTML→画像→PDF）

推奨：jsPDF + jspdf-autotable

```bash
npm install jspdf jspdf-autotable
```

## 日本語フォント対応

- jsPDFはデフォルトで日本語非対応
- IPAフォント等の日本語フォントをBase64で埋め込むか、Noto Sans JPのサブセットを使用
- フォントファイルが重い場合は、html2canvas方式を検討

## PDF構成

### 1ページ目：見積もり明細

- タイトル「お 見 積 書」
- ヘッダー情報（客先名、見積日、見積番号、有効期限、納期）
- 合計金額（大きく表示）
- 明細テーブル（項目 / 単価 / 数量 / 小計）
- 集計（小計 / 納期調整 / 割引 / 消費税 / 合計）

### 2ページ目：サイト仕様

- 基本情報
- デザイン設定（カラーコードはテキストで表記）
- 機能一覧
- 参考情報

### 3ページ目：備考・補足事項

- 注意事項
- 保守サポート
- 支払い条件

## ロゴ

- なし（入れない）

## レイアウト

- A4縦向き
- マージン：上下左右20mm
- シンプルで読みやすいレイアウト
- テーブルは枠線付き、ヘッダー行に背景色

## ファイル名

```
MitsuMO_見積書_[客先名]_[YYYYMMDD].pdf
```

## ダウンロード

```javascript
doc.save(fileName);
```
