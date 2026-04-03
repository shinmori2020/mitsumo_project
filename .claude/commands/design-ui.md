# デザインUI実装指示

このコマンドを実行する前に、必ず以下を参照すること：
- skills/design-system/SKILL.md（デザインシステム全体）

---

## 実装方針

- skills/design-system/SKILL.md のカラーコード・サイズ・角丸の値に厳密に従う
- CSS Modulesを使用。グローバルCSSは最小限に
- モバイルファーストで設計。最小幅320pxで崩れないこと

## CSS変数（グローバル定義）

```css
:root {
  --color-main: #1D9E75;
  --color-sub1: #E1F5EE;
  --color-sub2: #9FE1CB;
  --color-sub3: #5DCAA5;
  --color-dark: #085041;
  --color-text-heading: #085041;
  --color-text-sub: #0F6E56;
  --color-white: #FFFFFF;
  --radius-pill: 24px;
  --radius-card: 20px;
  --radius-group-top: 12px;
  --radius-input: 14px;
  --radius-button: 16px;
  --font-family: "M PLUS Rounded 1c", "Rounded Mplus 1c", "Hiragino Maru Gothic ProN", sans-serif;
}
```

## Google Fonts読み込み

```html
<link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500&display=swap" rel="stylesheet">
```

## 再利用コンポーネント一覧

各コンポーネントの詳細なスタイルは skills/design-system/SKILL.md を参照。

1. PillButton — ピル型選択ボタン
2. ToggleSwitch — トグルスイッチ（ON/OFF）
3. ToggleRow — トグル行（ラベル＋補足テキスト＋トグル）
4. Slider — スライダー＋数値バッジ
5. StepIndicator — ステップインジケーター（上部固定）
6. PriceBar — 金額バー（下部固定）
7. GroupCard — グループラベル＋ボックス
8. DropdownSelect — ドロップダウン選択
9. ColorSwatch — カラースウォッチカード
10. LayoutPreview — レイアウトプレビューカード
11. ExportButton — 出力ボタン（アイコン付き）
12. ResultCard — 結果カード（合計金額表示）
13. DetailTable — 内訳テーブル

## レスポンシブ対応

- ブレークポイントは設けず、フレキシブルに対応
- ピル型ボタンはflex-wrapで折り返し
- カラースウォッチは横並び→縦並びに
- レイアウトプレビューは2×2グリッド維持（min-width: 140px）
