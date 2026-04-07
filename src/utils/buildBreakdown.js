import { PRICING } from '../data/pricing';

// 内訳テーブル用のデータを生成
export function buildBreakdown(estimate) {
  const items = [];

  // カテゴリ1：基本費用
  if (estimate.buildMethod === 'wordpress') {
    items.push({ label: 'WordPress構築基本費', qty: 1, unit: PRICING.base_wp });
  } else {
    items.push({ label: 'コーディング基本費', qty: 1, unit: PRICING.base_html });
  }

  // カテゴリ2：ページコーディング
  if (estimate.topPage) items.push({ label: 'トップページ', qty: 1, unit: PRICING.page_top });
  if (estimate.subPageCount > 0) items.push({ label: '下層ページ', qty: estimate.subPageCount, unit: PRICING.page_sub });
  if (estimate.lpPageCount > 0) items.push({ label: 'LPページ', qty: estimate.lpPageCount, unit: PRICING.page_lp });
  if (estimate.tplBlog) items.push({ label: 'ブログ記事テンプレート', qty: 1, unit: PRICING.tpl_blog });
  if (estimate.tplArchive) items.push({ label: 'アーカイブテンプレート', qty: 1, unit: PRICING.tpl_archive });
  if (estimate.page404) items.push({ label: '404ページ', qty: 1, unit: PRICING.page_404 });

  // カテゴリ3：機能実装
  if (estimate.funcForm) items.push({ label: 'お問い合わせフォーム', qty: 1, unit: PRICING.func_form });
  if (estimate.funcBlog) items.push({ label: 'ブログ・新着情報機能', qty: 1, unit: PRICING.func_blog });
  if (estimate.funcSearch) items.push({ label: '検索機能', qty: 1, unit: PRICING.func_search });
  if (estimate.funcFilter) items.push({ label: 'カテゴリー・タグ絞り込み', qty: 1, unit: PRICING.func_filter });
  if (estimate.funcPagination) items.push({ label: 'ページネーション', qty: 1, unit: PRICING.func_pagination });
  if (estimate.funcBreadcrumb) items.push({ label: 'パンくずリスト', qty: 1, unit: PRICING.func_breadcrumb });
  if (estimate.funcSlider) items.push({ label: 'スライダー・カルーセル', qty: 1, unit: PRICING.func_slider });
  if (estimate.funcAccordion) items.push({ label: 'アコーディオン・タブ', qty: 1, unit: PRICING.func_accordion });
  if (estimate.funcModal) items.push({ label: 'モーダル', qty: 1, unit: PRICING.func_modal });
  if (estimate.animLevel === 'simple') items.push({ label: 'アニメーション（シンプル）', qty: 1, unit: PRICING.func_anim_simple });
  if (estimate.animLevel === 'rich') items.push({ label: 'アニメーション（リッチ）', qty: 1, unit: PRICING.func_anim_rich });
  if (estimate.funcSns) items.push({ label: 'SNS連携', qty: 1, unit: PRICING.func_sns });
  if (estimate.funcMap) items.push({ label: 'Googleマップ埋め込み', qty: 1, unit: PRICING.func_map });

  // カテゴリ4：WordPress固有
  if (estimate.buildMethod === 'wordpress') {
    if (estimate.wpAcf) items.push({ label: 'カスタムフィールド構築', qty: 1, unit: PRICING.wp_acf });
    if (estimate.wpAdmin) items.push({ label: 'WP管理画面カスタマイズ', qty: 1, unit: PRICING.wp_admin });
    if (estimate.wpPlugin) items.push({ label: 'プラグインセットアップ', qty: 1, unit: PRICING.wp_plugin });
  }

  // カテゴリ5：EC関連
  if (estimate.siteType === 'ec') {
    if (estimate.ecBase) items.push({ label: 'EC基本構築', qty: 1, unit: PRICING.ec_base });
    if (estimate.ecProduct) items.push({ label: '商品ページテンプレート', qty: 1, unit: PRICING.ec_product });
    if (estimate.ecCart) items.push({ label: 'カート・決済連携', qty: 1, unit: PRICING.ec_cart });
  }

  // カテゴリ6：最適化
  if (estimate.responsive) items.push({ label: 'レスポンシブ対応', qty: 1, unit: PRICING.opt_responsive });
  if (estimate.optSsl) items.push({ label: 'SSL対応', qty: 1, unit: PRICING.opt_ssl });
  if (estimate.optSeo) items.push({ label: 'SEO基本設定', qty: 1, unit: PRICING.opt_seo });
  if (estimate.optSpeed) items.push({ label: '表示速度最適化', qty: 1, unit: PRICING.opt_speed });
  if (estimate.optBrowser) items.push({ label: 'クロスブラウザ対応', qty: 1, unit: PRICING.opt_browser });
  if (estimate.optGa) items.push({ label: 'GA・サーチコンソール設置', qty: 1, unit: PRICING.opt_ga });
  if (estimate.optFavicon) items.push({ label: 'ファビコン・OGP設定', qty: 1, unit: PRICING.opt_favicon });

  // カテゴリ7：納品
  if (estimate.delExport) items.push({ label: '画像書き出し', qty: 1, unit: PRICING.del_export });
  if (estimate.dataMigration) items.push({ label: 'データ移行', qty: 1, unit: PRICING.del_migration });
  if (estimate.delTest) items.push({ label: 'テストサーバー検証', qty: 1, unit: PRICING.del_test });
  if (estimate.delManual) items.push({ label: '更新マニュアル作成', qty: 1, unit: PRICING.del_manual });
  if (estimate.delFix) items.push({ label: '公開後の修正対応', qty: 1, unit: PRICING.del_fix });

  return items;
}
