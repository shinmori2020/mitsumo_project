# Step3「デザイン仕様」実装指示

このコマンドを実行する前に、必ず以下を参照すること：
- skills/step-screens/SKILL.md（Step3の画面仕様）
- skills/design-system/SKILL.md（デザイン仕様）

---

## 概要

Step3はサイトのデザインに関する希望を入力する画面。金額に影響しない。入力データはExcel出力のSheet2に反映される。

## 実装するコンポーネント

`src/components/steps/Step3Design.jsx`

## 実装内容

1. 配色テーマ（カラースウォッチカード×3）
   - メイン・サブ・アクセントの3色
   - タップするとカラーピッカーを表示
   - 選択したカラーコードをカード下部に表示
   - デフォルト値：メイン=#2B4C7E、サブ=#4A90D9、アクセント=#E8913A

2. フォントの雰囲気（ピル型選択）
   - やわらかい / シャープ / フォーマル / カジュアル

3. レイアウトイメージ（2×2グリッド）
   - パターンA：ヘッダー大・写真メイン
   - パターンB：サイドバー付・情報整理型
   - パターンC：1カラム・スクロール型
   - パターンD：グリッド・ギャラリー型
   - 選択状態はボーダーで強調（2px solid メインカラー）

4. 参考サイトURL（テキスト入力×2）

5. その他の要望（テキストエリア）

## カラーピッカーの実装

- HTML5の `<input type="color">` を使用（シンプルに）
- カラースウォッチカードをクリックするとcolor inputが発火
- 選択後にカードの色とカラーコード表示が更新される

## 状態として保持するデータ

```javascript
{
  colorMain: '#2B4C7E',
  colorSub: '#4A90D9',
  colorAccent: '#E8913A',
  fontStyle: 'sharp', // soft | sharp | formal | casual
  layoutPattern: 'A', // A | B | C | D
  refUrl1: '',
  refUrl2: '',
  otherRequests: ''
}
```

## ボタン

- 「戻る」：Step2へ戻る
- 「次へ進む」：Step4へ遷移
