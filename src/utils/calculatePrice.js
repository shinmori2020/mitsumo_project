import { PRICING, TAX_RATE } from '../data/pricing';

// 見積もり全体の金額計算
export function calculatePrice(estimate) {
  let subtotal = 0;

  // カテゴリ1：基本費用（排他選択）
  if (estimate.buildMethod === 'wordpress') {
    subtotal += PRICING.base_wp;
  } else {
    subtotal += PRICING.base_html;
  }

  // カテゴリ2：ページコーディング
  if (estimate.topPage) subtotal += PRICING.page_top;
  subtotal += PRICING.page_sub * (estimate.subPageCount || 0);
  subtotal += PRICING.page_lp * (estimate.lpPageCount || 0);
  if (estimate.tplBlog) subtotal += PRICING.tpl_blog;
  if (estimate.tplArchive) subtotal += PRICING.tpl_archive;
  if (estimate.page404) subtotal += PRICING.page_404;

  // カテゴリ3：機能実装
  if (estimate.funcForm) subtotal += PRICING.func_form;
  if (estimate.funcBlog) subtotal += PRICING.func_blog;
  if (estimate.funcFilter) subtotal += PRICING.func_filter;
  if (estimate.funcSearch) subtotal += PRICING.func_search;
  if (estimate.funcSns) subtotal += PRICING.func_sns;
  if (estimate.funcMap) subtotal += PRICING.func_map;
  if (estimate.funcSlider) subtotal += PRICING.func_slider;
  if (estimate.funcAccordion) subtotal += PRICING.func_accordion;
  if (estimate.funcModal) subtotal += PRICING.func_modal;
  if (estimate.animLevel === 'simple') subtotal += PRICING.func_anim_simple;
  if (estimate.animLevel === 'rich') subtotal += PRICING.func_anim_rich;
  if (estimate.funcPagination) subtotal += PRICING.func_pagination;
  if (estimate.funcBreadcrumb) subtotal += PRICING.func_breadcrumb;

  // カテゴリ4：WordPress固有
  if (estimate.buildMethod === 'wordpress') {
    if (estimate.wpAcf) subtotal += PRICING.wp_acf;
    if (estimate.wpAdmin) subtotal += PRICING.wp_admin;
    if (estimate.wpPlugin) subtotal += PRICING.wp_plugin;
  }

  // カテゴリ5：EC関連
  if (estimate.siteType === 'ec') {
    if (estimate.ecBase) subtotal += PRICING.ec_base;
    if (estimate.ecProduct) subtotal += PRICING.ec_product;
    if (estimate.ecCart) subtotal += PRICING.ec_cart;
  }

  // カテゴリ6：最適化・設定
  if (estimate.responsive) subtotal += PRICING.opt_responsive;
  if (estimate.optSsl) subtotal += PRICING.opt_ssl;
  if (estimate.optSeo) subtotal += PRICING.opt_seo;
  if (estimate.optSpeed) subtotal += PRICING.opt_speed;
  if (estimate.optBrowser) subtotal += PRICING.opt_browser;
  if (estimate.optGa) subtotal += PRICING.opt_ga;
  if (estimate.optFavicon) subtotal += PRICING.opt_favicon;

  // カテゴリ7：納品・サポート
  if (estimate.delExport) subtotal += PRICING.del_export;
  if (estimate.dataMigration) subtotal += PRICING.del_migration;
  if (estimate.delTest) subtotal += PRICING.del_test;
  if (estimate.delManual) subtotal += PRICING.del_manual;
  if (estimate.delFix) subtotal += PRICING.del_fix;
  if (estimate.supportPlan === 'light') subtotal += PRICING.support_light;
  if (estimate.supportPlan === 'standard') subtotal += PRICING.support_std;

  // カテゴリ8：納期倍率
  const deadlineRate = estimate.deadlineRate || 1.0;
  const afterDeadline = Math.round(subtotal * deadlineRate);
  const deadlineAdjustment = afterDeadline - subtotal;

  // 割引適用
  let discount = 0;
  if (estimate.discountType === 'amount') {
    discount = estimate.discountValue || 0;
  } else if (estimate.discountType === 'rate') {
    discount = Math.round(afterDeadline * ((estimate.discountValue || 0) / 100));
  }

  const afterDiscount = afterDeadline - discount;

  // 消費税
  const tax = Math.round(afterDiscount * TAX_RATE);
  const total = afterDiscount + tax;

  return {
    subtotal,
    deadlineAdjustment,
    afterDeadline,
    discount,
    afterDiscount,
    tax,
    total,
  };
}
