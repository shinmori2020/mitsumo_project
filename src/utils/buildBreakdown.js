import { PRICING } from '../data/pricing';

// 内訳テーブル用のデータを生成（カテゴリ付き）
export function buildBreakdown(estimate) {
  const items = [];

  // カテゴリ1：基本費用
  if (estimate.buildMethod === 'wordpress') {
    items.push({ label: 'WordPress構築基本費', qty: 1, unit: PRICING.base_wp, category: '基本費用' });
  } else {
    items.push({ label: 'コーディング基本費', qty: 1, unit: PRICING.base_html, category: '基本費用' });
  }

  // カテゴリ2：ページコーディング
  if (estimate.topPage) items.push({ label: 'トップページ', qty: 1, unit: PRICING.page_top, category: 'ページ' });
  if (estimate.subPageCount > 0) items.push({ label: '下層ページ', qty: estimate.subPageCount, unit: PRICING.page_sub, category: 'ページ' });
  if (estimate.lpPageCount > 0) items.push({ label: 'LPページ', qty: estimate.lpPageCount, unit: PRICING.page_lp, category: 'ページ' });
  if (estimate.tplBlog) items.push({ label: 'ブログ記事テンプレート', qty: 1, unit: PRICING.tpl_blog, category: 'ページ' });
  if (estimate.tplArchive) items.push({ label: 'アーカイブテンプレート', qty: 1, unit: PRICING.tpl_archive, category: 'ページ' });
  if (estimate.page404) items.push({ label: '404ページ', qty: 1, unit: PRICING.page_404, category: 'ページ' });

  // カテゴリ3：機能実装
  if (estimate.funcForm) items.push({ label: 'お問い合わせフォーム', qty: 1, unit: PRICING.func_form, category: '機能' });
  if (estimate.funcBlog) items.push({ label: 'ブログ・新着情報機能', qty: 1, unit: PRICING.func_blog, category: '機能' });
  if (estimate.funcSearch) items.push({ label: '検索機能', qty: 1, unit: PRICING.func_search, category: '機能' });
  if (estimate.funcFilter) items.push({ label: 'カテゴリー・タグ絞り込み', qty: 1, unit: PRICING.func_filter, category: '機能' });
  if (estimate.funcPagination) items.push({ label: 'ページネーション', qty: 1, unit: PRICING.func_pagination, category: '機能' });
  if (estimate.funcBreadcrumb) items.push({ label: 'パンくずリスト', qty: 1, unit: PRICING.func_breadcrumb, category: '機能' });
  if (estimate.funcSlider) items.push({ label: 'スライダー・カルーセル', qty: 1, unit: PRICING.func_slider, category: '機能' });
  if (estimate.funcAccordion) items.push({ label: 'アコーディオン・タブ', qty: 1, unit: PRICING.func_accordion, category: '機能' });
  if (estimate.funcModal) items.push({ label: 'モーダル', qty: 1, unit: PRICING.func_modal, category: '機能' });
  if (estimate.animLevel === 'simple') items.push({ label: 'アニメーション（シンプル）', qty: 1, unit: PRICING.func_anim_simple, category: '機能' });
  if (estimate.animLevel === 'rich') items.push({ label: 'アニメーション（リッチ）', qty: 1, unit: PRICING.func_anim_rich, category: '機能' });
  if (estimate.funcSns) items.push({ label: 'SNS連携', qty: 1, unit: PRICING.func_sns, category: '機能' });
  if (estimate.funcMap) items.push({ label: 'Googleマップ埋め込み', qty: 1, unit: PRICING.func_map, category: '機能' });

  // カテゴリ4：WordPress固有
  if (estimate.buildMethod === 'wordpress') {
    if (estimate.wpAcf) items.push({ label: 'カスタムフィールド構築', qty: 1, unit: PRICING.wp_acf, category: 'WordPress' });
    if (estimate.wpAdmin) items.push({ label: 'WP管理画面カスタマイズ', qty: 1, unit: PRICING.wp_admin, category: 'WordPress' });
    if (estimate.wpPlugin) items.push({ label: 'プラグインセットアップ', qty: 1, unit: PRICING.wp_plugin, category: 'WordPress' });
  }

  // カテゴリ5：EC関連
  if (estimate.siteType === 'ec') {
    if (estimate.ecBase) items.push({ label: 'EC基本構築', qty: 1, unit: PRICING.ec_base, category: 'EC' });
    if (estimate.ecProduct) items.push({ label: '商品ページテンプレート', qty: 1, unit: PRICING.ec_product, category: 'EC' });
    if (estimate.ecCart) items.push({ label: 'カート・決済連携', qty: 1, unit: PRICING.ec_cart, category: 'EC' });
  }

  // カテゴリ6：最適化
  if (estimate.responsive) items.push({ label: 'レスポンシブ対応', qty: 1, unit: PRICING.opt_responsive, category: '最適化' });
  if (estimate.optSsl) items.push({ label: 'SSL対応', qty: 1, unit: PRICING.opt_ssl, category: '最適化' });
  if (estimate.optSeo) items.push({ label: 'SEO基本設定', qty: 1, unit: PRICING.opt_seo, category: '最適化' });
  if (estimate.optSpeed) items.push({ label: '表示速度最適化', qty: 1, unit: PRICING.opt_speed, category: '最適化' });
  if (estimate.optBrowser) items.push({ label: 'クロスブラウザ対応', qty: 1, unit: PRICING.opt_browser, category: '最適化' });
  if (estimate.optGa) items.push({ label: 'GA・サーチコンソール設置', qty: 1, unit: PRICING.opt_ga, category: '最適化' });
  if (estimate.optFavicon) items.push({ label: 'ファビコン・OGP設定', qty: 1, unit: PRICING.opt_favicon, category: '最適化' });

  // カテゴリ7：納品
  if (estimate.delExport) items.push({ label: '画像書き出し', qty: 1, unit: PRICING.del_export, category: '納品' });
  if (estimate.dataMigration) items.push({ label: 'データ移行', qty: 1, unit: PRICING.del_migration, category: '納品' });
  if (estimate.delTest) items.push({ label: 'テストサーバー検証', qty: 1, unit: PRICING.del_test, category: '納品' });
  if (estimate.delManual) items.push({ label: '更新マニュアル作成', qty: 1, unit: PRICING.del_manual, category: '納品' });
  if (estimate.delFix) items.push({ label: '公開後の修正対応', qty: 1, unit: PRICING.del_fix, category: '納品' });

  return items;
}
