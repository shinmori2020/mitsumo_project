# Excel出力機能 実装指示

このコマンドを実行する前に、必ず以下を参照すること：
- skills/excel-spec/SKILL.md（Excel 3シート構成の詳細仕様）
- skills/pricing/SKILL.md（単価データ）

---

## 概要

SheetJSを使って3シート構成のExcelファイルをブラウザ内で生成し、ダウンロードさせる。

## 実装するコンポーネント

`src/components/export/ExcelExport.jsx`

## ライブラリ

```bash
npm install xlsx
```

## 実装手順

### 1. ワークブック作成

```javascript
import * as XLSX from 'xlsx';

const wb = XLSX.utils.book_new();
```

### 2. Sheet1「見積もり明細」の作成

- ヘッダー行（客先名、見積日、見積番号、有効期限、納期）
- 合計金額表示行
- 明細テーブル（項目 / 単価 / 数量 / 小計 / 備考）
  - ONにした項目のみ行を生成
  - 金額は数値型で入れ、書式を設定
- 集計行（小計 / 納期調整 / 割引 / 消費税 / 合計）

### 3. Sheet2「サイト仕様」の作成

- 基本情報（サイト種別 / 制作方式 / ページ数 / レスポンシブ）
- デザイン設定（3色のカラーコード / フォント / レイアウト）
- 機能一覧（ON/OFF）
- 参考情報（URL / その他要望）

### 4. Sheet3「備考・補足事項」の作成

- 自由記述メモ（otherNotes）
- 注意事項（修正回数 / 定型文）
- 保守サポート（プラン / 月額）
- 支払い条件（タイミング / 方法）

### 5. 列幅設定

```javascript
ws['!cols'] = [
  { wch: 6 },   // No.
  { wch: 32 },  // 項目
  { wch: 14 },  // 単価
  { wch: 10 },  // 数量
  { wch: 16 },  // 小計
  { wch: 24 },  // 備考
];
```

### 6. ダウンロード実行

```javascript
const fileName = `MitsuMO_見積書_${clientName}_${formatDate(new Date())}.xlsx`;
XLSX.writeFile(wb, fileName);
```

## 注意事項

- SheetJSのフリー版ではセルの背景色・フォント色の設定に制限がある
- 書式設定が反映されない場合はデータの正確性を優先する
- 日付はYYYY年MM月DD日形式の文字列として入れる
- 金額は数値型で保持し、表示書式を設定
