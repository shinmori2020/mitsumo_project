// 単価データ（skills/pricing/SKILL.md と完全一致）

// カテゴリ1：基本費用
export const base_html = 30000;
export const base_wp = 80000;

// カテゴリ2：ページコーディング
export const page_top = 50000;
export const page_sub = 15000;
export const page_lp = 50000;
export const tpl_blog = 20000;
export const tpl_archive = 15000;
export const page_404 = 5000;

// カテゴリ3：機能実装
export const func_form = 30000;
export const func_blog = 40000;
export const func_filter = 20000;
export const func_search = 20000;
export const func_sns = 10000;
export const func_map = 5000;
export const func_slider = 15000;
export const func_accordion = 10000;
export const func_modal = 10000;
export const func_anim_simple = 15000;
export const func_anim_rich = 40000;
export const func_pagination = 8000;
export const func_breadcrumb = 3000;

// カテゴリ4：WordPress固有
export const wp_acf = 30000;
export const wp_admin = 20000;
export const wp_plugin = 15000;

// カテゴリ5：EC関連
export const ec_base = 80000;
export const ec_product = 30000;
export const ec_cart = 30000;

// カテゴリ6：最適化・設定
export const opt_responsive = 30000;
export const opt_ssl = 5000;
export const opt_seo = 20000;
export const opt_speed = 30000;
export const opt_browser = 10000;
export const opt_ga = 8000;
export const opt_favicon = 5000;

// カテゴリ7：納品・サポート
export const del_export = 10000;
export const del_migration = 50000;
export const del_test = 15000;
export const del_manual = 20000;
export const del_fix = 15000;
export const support_light = 5000;
export const support_std = 15000;

// 消費税率
export const TAX_RATE = 0.1;

// 全項目をオブジェクトとしてもエクスポート
export const PRICING = {
  base_html, base_wp,
  page_top, page_sub, page_lp, tpl_blog, tpl_archive, page_404,
  func_form, func_blog, func_filter, func_search, func_sns, func_map,
  func_slider, func_accordion, func_modal, func_anim_simple, func_anim_rich,
  func_pagination, func_breadcrumb,
  wp_acf, wp_admin, wp_plugin,
  ec_base, ec_product, ec_cart,
  opt_responsive, opt_ssl, opt_seo, opt_speed, opt_browser, opt_ga, opt_favicon,
  del_export, del_migration, del_test, del_manual, del_fix,
  support_light, support_std,
};
