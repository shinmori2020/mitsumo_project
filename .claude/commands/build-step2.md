# Step2「機能選択」実装指示

このコマンドを実行する前に、必ず以下を参照すること：
- skills/step-screens/SKILL.md（Step2の画面仕様）
- skills/pricing/SKILL.md（単価データ）
- skills/design-system/SKILL.md（デザイン仕様）

---

## 概要

Step2はサイトに追加する機能を選択する画面。カテゴリ3（機能実装）・カテゴリ4（WordPress固有）・カテゴリ5（EC関連）に対応する。

## 実装するコンポーネント

`src/components/steps/Step2Features.jsx`

## 実装内容

5つのグループをGroupCardコンポーネントで表示する。各項目はトグル形式。

1. 基本機能グループ（6項目）：フォーム / ブログ / 検索 / 絞り込み / ページネーション / パンくず
2. UIパーツグループ（4項目）：スライダー / アコーディオン / モーダル / アニメーション（ドロップダウン）
3. 外部連携グループ（2項目）：SNS / Googleマップ
4. WordPress固有グループ（3項目）：ACF / 管理画面 / プラグイン
5. EC関連グループ（3項目）：EC基本 / 商品ページ / カート

## 条件表示ロジック

- Step1のbuildMethodが 'wordpress' の場合 → WordPress固有グループを表示
- Step1のbuildMethodが 'html' の場合 → WordPress固有グループを非表示
- Step1のsiteTypeが 'ec' の場合 → EC関連グループを通常表示
- Step1のsiteTypeが 'ec' 以外 → EC関連グループにグレーアウト案内文を表示

## アニメーションの排他選択

- ドロップダウンで「なし / シンプル / リッチ」を選択
- なし=0円、シンプル=15,000円（func_anim_simple）、リッチ=40,000円（func_anim_rich）
- 同時に両方加算されない

## 状態として保持するデータ

```javascript
{
  funcForm: true,
  funcBlog: true,
  funcSearch: false,
  funcFilter: true,
  funcPagination: true,
  funcBreadcrumb: true,
  funcSlider: true,
  funcAccordion: false,
  funcModal: false,
  animationType: 'simple', // none | simple | rich
  funcSns: true,
  funcMap: true,
  wpAcf: true,
  wpAdmin: false,
  wpPlugin: true,
  ecBase: false,
  ecProduct: false,
  ecCart: false
}
```

## ボタン

- 「戻る」：Step1へ戻る
- 「次へ進む」：Step3へ遷移
