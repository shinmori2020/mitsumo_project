# Step1「サイトの基本情報」実装指示

このコマンドを実行する前に、必ず以下を参照すること：
- skills/step-screens/SKILL.md（Step1の画面仕様）
- skills/pricing/SKILL.md（単価データ）
- skills/design-system/SKILL.md（デザイン仕様）
- .claude/commands/coding-rules.md（コーディングルール）

---

## 概要

Step1はサイトの基本的な構成を決める画面。カテゴリ1（基本費用）とカテゴリ2（ページコーディング）に対応する。

## 実装するコンポーネント

`src/components/steps/Step1BasicInfo.jsx`

## 実装内容

1. サイトの種類をピル型ボタンで選択（コーポレート / LP / EC / ブログ）
2. 制作方式をピル型ボタンで選択（WordPress / HTML・CSS）
   - WordPress → base_wp(80,000) を加算
   - HTML/CSS → base_html(30,000) を加算
   - 排他選択（両方同時に加算しない）
3. トップページのトグル → ON時 page_top(50,000) を加算
4. 下層ページ数のスライダー（0〜30） → page_sub(15,000) × 数量
5. LPページ数のスライダー（0〜10） → page_lp(50,000) × 数量
6. テンプレートページ3つのトグル
   - ブログ記事テンプレート → tpl_blog(20,000)
   - アーカイブテンプレート → tpl_archive(15,000)
   - 404ページ → page_404(5,000)
7. レスポンシブ対応のトグル → opt_responsive(30,000)
8. データ移行のトグル → del_migration(50,000)

## 金額計算ロジック

選択・入力が変わるたびにリアルタイムで合計金額を再計算し、PriceBarに反映する。

## 状態として保持するデータ

```javascript
{
  siteType: 'corporate', // corporate | lp | ec | blog
  buildMethod: 'wordpress', // wordpress | html
  topPage: true,
  subPageCount: 5,
  lpPageCount: 0,
  tplBlog: true,
  tplArchive: true,
  page404: false,
  responsive: true,
  dataMigration: false
}
```

## ボタン

- 「戻る」：disabled（Step1なので押せない）
- 「次へ進む」：Step2へ遷移
