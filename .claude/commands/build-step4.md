# Step4「その他オプション」実装指示

このコマンドを実行する前に、必ず以下を参照すること：
- skills/step-screens/SKILL.md（Step4の画面仕様）
- skills/pricing/SKILL.md（単価データ・金額計算フロー）
- skills/design-system/SKILL.md（デザイン仕様）

---

## 概要

Step4は最適化・納品・サポート・料金調整と、備考・ヘッダー情報を入力する画面。カテゴリ6・7・8に対応。割引機能もここで設定する。

## 実装するコンポーネント

`src/components/steps/Step4Options.jsx`

## 実装内容

### 最適化・設定グループ（6項目、トグル）
- SSL(5,000) / SEO(20,000) / 速度最適化(30,000) / クロスブラウザ(10,000) / GA(8,000) / ファビコン(5,000)

### 納品関連グループ（4項目、トグル）
- 画像書き出し(10,000) / テスト検証(15,000) / マニュアル(20,000) / 修正対応(15,000)

### 保守・運用サポートグループ（ドロップダウン）
- なし(0) / ライト(月額5,000) / スタンダード(月額15,000)
- 月額は見積もりの一括金額には含めず、別途表示する

### 納期・料金調整グループ（ドロップダウン）
- 通常(×1.0) / 急ぎ(×1.3) / 特急(×1.5)
- 乗算は割引適用前の小計に対して行う

### 割引グループ
- ピル型選択：なし / 値引き額 / 割引率
- 「値引き額」選択時：円単位の数値入力を表示
- 「割引率」選択時：%単位の数値入力を表示
- 「なし」選択時：入力欄を非表示

### 見積もりヘッダー情報
- お客様名（テキスト入力）
- 納期の希望（テキスト入力）

### 備考情報
- デザイン修正の無料回数（テキスト入力）
- 支払いタイミング（テキスト入力）
- 支払い方法（テキスト入力）
- その他備考（テキストエリア）

## 金額計算ロジック（納期・割引）

```
1. 小計 = Step1〜4の全選択項目の合算
2. 納期調整後 = 小計 × 納期倍率
3. 割引適用後 = 納期調整後 - 値引き額  or  納期調整後 × (1 - 割引率/100)
4. 消費税 = Math.round(割引適用後 × 0.1)
5. 合計（税込）= 割引適用後 + 消費税
```

## 状態として保持するデータ

```javascript
{
  optSsl: true,
  optSeo: true,
  optSpeed: false,
  optBrowser: true,
  optGa: true,
  optFavicon: true,
  delExport: true,
  delTest: true,
  delManual: true,
  delFix: true,
  supportPlan: 'none', // none | light | standard
  deadline: 'normal', // normal | rush | urgent
  discountType: 'none', // none | amount | rate
  discountAmount: 0,
  discountRate: 0,
  clientName: '',
  deliveryDate: '',
  revisionCount: '',
  paymentTiming: '',
  paymentMethod: '',
  otherNotes: ''
}
```

## ボタン

- 「戻る」：Step3へ戻る
- 「結果を見る」：Step5へ遷移
