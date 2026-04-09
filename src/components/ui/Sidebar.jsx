// サイドバー：選択内容サマリー＋金額表示
import { useState, useEffect, useRef } from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { PRICING } from '../../data/pricing';
import styles from './Sidebar.module.css';

const SITE_TYPE_LABELS = {
  corporate: 'コーポレート',
  lp: 'LP',
  ec: 'EC',
  blog: 'ブログ',
};

const BUILD_METHOD_LABELS = {
  wordpress: 'WordPress',
  html: 'HTML・CSS',
};

const ANIM_LABELS = {
  none: 'なし',
  simple: 'シンプル',
  rich: 'リッチ',
};

const SUPPORT_LABELS = {
  none: 'なし',
  light: 'ライト',
  standard: 'スタンダード',
};

const DEADLINE_LABELS = {
  1.0: '通常',
  1.3: '急ぎ（×1.3）',
  1.5: '特急（×1.5）',
};

export default function Sidebar({ estimate, price, position }) {
  const [pulse, setPulse] = useState(false);
  const [showTaxInc, setShowTaxInc] = useState(true);
  const prevTotal = useRef(price.total);

  useEffect(() => {
    if (price.total !== prevTotal.current) {
      setPulse(true);
      prevTotal.current = price.total;
      const timer = setTimeout(() => setPulse(false), 500);
      return () => clearTimeout(timer);
    }
  }, [price.total]);

  return (
    <aside className={`${styles.sidebar} ${position === 'right' ? styles.sidebarRight : ''}`}>
      {/* 金額カード */}
      <div className={`${styles.priceCard} ${pulse ? styles.pricePulse : ''}`}>
        <div className={styles.priceLabelRow}>
          <span className={styles.priceLabel}>お見積もり金額</span>
          <button
            className={styles.taxToggle}
            onClick={() => setShowTaxInc(!showTaxInc)}
          >
            {showTaxInc ? '税込' : '税抜'}
          </button>
        </div>
        <div className={styles.priceMainRow}>
          <span className={styles.priceAmount}>
            {formatCurrency(showTaxInc ? price.total : price.afterDiscount)}
          </span>
          <span className={styles.priceYen}>円</span>
          <span className={styles.priceTaxInc}>({showTaxInc ? '税込' : '税抜'})</span>
        </div>
        <hr className={styles.priceDivider} />
        <div className={styles.priceSubRow}>
          <span className={styles.priceSubLabel}>{showTaxInc ? '税抜' : '税込'}</span>
          <span className={styles.priceSubAmount}>
            {formatCurrency(showTaxInc ? price.afterDiscount : price.total)}円
          </span>
        </div>
        <div className={styles.priceSubRow}>
          <span className={styles.priceSubLabel}>消費税</span>
          <span className={styles.priceSubAmount}>{formatCurrency(price.tax)}円</span>
        </div>
        {price.discount > 0 && (
          <div className={styles.priceSubRow}>
            <span className={styles.priceSubLabel}>割引</span>
            <span className={styles.priceSubAmount}>-{formatCurrency(price.discount)}円</span>
          </div>
        )}
      </div>

      {/* Step1：基本情報 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Step1 基本情報</div>
        <ul className={styles.itemList}>
          <li className={styles.item}>
            <span className={styles.itemLabel}>サイトの種類</span>
            <span className={styles.badge}>{SITE_TYPE_LABELS[estimate.siteType]}</span>
          </li>
          <li className={styles.item}>
            <span className={styles.itemLabel}>制作方式</span>
            <span className={styles.badge}>{BUILD_METHOD_LABELS[estimate.buildMethod]}</span>
          </li>
          <li className={styles.item}>
            <span className={styles.itemLabel}>トップページ</span>
            <span className={estimate.topPage ? styles.itemValue : styles.itemOff}>
              {estimate.topPage ? '¥' + formatCurrency(PRICING.page_top) : 'OFF'}
            </span>
          </li>
          <li className={styles.item}>
            <span className={styles.itemLabel}>下層ページ</span>
            <span className={estimate.subPageCount > 0 ? styles.itemValue : styles.itemOff}>
              {estimate.subPageCount > 0
                ? `${estimate.subPageCount}P ¥${formatCurrency(PRICING.page_sub * estimate.subPageCount)}`
                : '0P'}
            </span>
          </li>
          <li className={styles.item}>
            <span className={styles.itemLabel}>LPページ</span>
            <span className={estimate.lpPageCount > 0 ? styles.itemValue : styles.itemOff}>
              {estimate.lpPageCount > 0
                ? `${estimate.lpPageCount}P ¥${formatCurrency(PRICING.page_lp * estimate.lpPageCount)}`
                : '0P'}
            </span>
          </li>
          <ToggleItem label="ブログ記事テンプレート" on={estimate.tplBlog} price={PRICING.tpl_blog} />
          <ToggleItem label="アーカイブテンプレート" on={estimate.tplArchive} price={PRICING.tpl_archive} />
          <ToggleItem label="404ページ" on={estimate.page404} price={PRICING.page_404} />
          <ToggleItem label="レスポンシブ対応" on={estimate.responsive} price={PRICING.opt_responsive} />
          <ToggleItem label="データ移行" on={estimate.dataMigration} price={PRICING.del_migration} />
        </ul>
      </div>

      {/* Step2：機能選択（選択されたもののみ表示） */}
      <Step2Summary estimate={estimate} />

      {/* Step3：デザイン仕様 */}
      <Step3Summary estimate={estimate} />

      {/* Step4：オプション（選択されたもののみ表示） */}
      <Step4Summary estimate={estimate} />
    </aside>
  );
}

// トグル項目の表示
function ToggleItem({ label, on, price }) {
  return (
    <li className={styles.item}>
      <span className={styles.itemLabel}>{label}</span>
      <span className={on ? styles.itemValue : styles.itemOff}>
        {on ? `¥${formatCurrency(price)}` : 'OFF'}
      </span>
    </li>
  );
}

// Step2サマリー
function Step2Summary({ estimate }) {
  const items = [
    { label: 'お問い合わせフォーム', on: estimate.funcForm, price: PRICING.func_form },
    { label: 'ブログ・新着情報', on: estimate.funcBlog, price: PRICING.func_blog },
    { label: '検索機能', on: estimate.funcSearch, price: PRICING.func_search },
    { label: 'カテゴリー絞り込み', on: estimate.funcFilter, price: PRICING.func_filter },
    { label: 'ページネーション', on: estimate.funcPagination, price: PRICING.func_pagination },
    { label: 'パンくずリスト', on: estimate.funcBreadcrumb, price: PRICING.func_breadcrumb },
    { label: 'スライダー', on: estimate.funcSlider, price: PRICING.func_slider },
    { label: 'アコーディオン', on: estimate.funcAccordion, price: PRICING.func_accordion },
    { label: 'モーダル', on: estimate.funcModal, price: PRICING.func_modal },
    { label: 'SNS連携', on: estimate.funcSns, price: PRICING.func_sns },
    { label: 'Googleマップ', on: estimate.funcMap, price: PRICING.func_map },
  ];

  if (estimate.buildMethod === 'wordpress') {
    items.push(
      { label: 'カスタムフィールド', on: estimate.wpAcf, price: PRICING.wp_acf },
      { label: 'WP管理画面カスタマイズ', on: estimate.wpAdmin, price: PRICING.wp_admin },
      { label: 'プラグインセットアップ', on: estimate.wpPlugin, price: PRICING.wp_plugin },
    );
  }

  if (estimate.siteType === 'ec') {
    items.push(
      { label: 'EC基本構築', on: estimate.ecBase, price: PRICING.ec_base },
      { label: '商品ページテンプレート', on: estimate.ecProduct, price: PRICING.ec_product },
      { label: 'カート・決済連携', on: estimate.ecCart, price: PRICING.ec_cart },
    );
  }

  // アニメーション
  if (estimate.animLevel !== 'none') {
    const animPrice = estimate.animLevel === 'simple' ? PRICING.func_anim_simple : PRICING.func_anim_rich;
    items.push({ label: `アニメーション（${ANIM_LABELS[estimate.animLevel]}）`, on: true, price: animPrice });
  }

  const activeItems = items.filter(item => item.on);

  if (activeItems.length === 0) {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Step2 機能選択</div>
        <div className={styles.emptyNote}>未選択</div>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>Step2 機能選択</div>
      <ul className={styles.itemList}>
        {activeItems.map((item) => (
          <ToggleItem key={item.label} label={item.label} on={true} price={item.price} />
        ))}
      </ul>
    </div>
  );
}

const FONT_STYLE_LABELS = {
  soft: 'やわらかい',
  sharp: 'シャープ',
  formal: 'フォーマル',
  casual: 'カジュアル',
};

const LAYOUT_LABELS = {
  A: 'パターンA',
  B: 'パターンB',
  C: 'パターンC',
  D: 'パターンD',
};

// Step3サマリー
function Step3Summary({ estimate }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>Step3 デザイン</div>
      <ul className={styles.itemList}>
        <li className={styles.item}>
          <span className={styles.itemLabel}>配色テーマ</span>
          <span style={{ display: 'flex', gap: '4px' }}>
            <span style={{ width: 18, height: 18, borderRadius: 4, backgroundColor: estimate.colorMain, display: 'inline-block' }} />
            <span style={{ width: 18, height: 18, borderRadius: 4, backgroundColor: estimate.colorSub, display: 'inline-block' }} />
            <span style={{ width: 18, height: 18, borderRadius: 4, backgroundColor: estimate.colorAccent, display: 'inline-block' }} />
          </span>
        </li>
        <li className={styles.item}>
          <span className={styles.itemLabel}>フォント</span>
          <span className={styles.badge}>{FONT_STYLE_LABELS[estimate.fontStyle]}</span>
        </li>
        <li className={styles.item}>
          <span className={styles.itemLabel}>レイアウト</span>
          <span className={styles.badge}>{LAYOUT_LABELS[estimate.layoutPattern]}</span>
        </li>
        {estimate.referenceUrl1 && (
          <li className={styles.item}>
            <span className={styles.itemLabel}>参考URL</span>
            <span className={styles.itemValue}>あり</span>
          </li>
        )}
      </ul>
    </div>
  );
}

// Step4サマリー
function Step4Summary({ estimate }) {
  const items = [
    { label: 'SSL対応', on: estimate.optSsl, price: PRICING.opt_ssl },
    { label: 'SEO基本設定', on: estimate.optSeo, price: PRICING.opt_seo },
    { label: '表示速度最適化', on: estimate.optSpeed, price: PRICING.opt_speed },
    { label: 'クロスブラウザ対応', on: estimate.optBrowser, price: PRICING.opt_browser },
    { label: 'GA・サーチコンソール', on: estimate.optGa, price: PRICING.opt_ga },
    { label: 'ファビコン・OGP', on: estimate.optFavicon, price: PRICING.opt_favicon },
    { label: '画像書き出し', on: estimate.delExport, price: PRICING.del_export },
    { label: 'テストサーバー検証', on: estimate.delTest, price: PRICING.del_test },
    { label: '更新マニュアル', on: estimate.delManual, price: PRICING.del_manual },
    { label: '公開後の修正対応', on: estimate.delFix, price: PRICING.del_fix },
  ];

  const activeItems = items.filter(item => item.on);
  const hasDeadline = estimate.deadlineRate > 1.0;
  const hasSupport = estimate.supportPlan !== 'none';

  if (activeItems.length === 0 && !hasDeadline && !hasSupport) {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Step4 オプション</div>
        <div className={styles.emptyNote}>未選択</div>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>Step4 オプション</div>
      <ul className={styles.itemList}>
        {activeItems.map((item) => (
          <ToggleItem key={item.label} label={item.label} on={true} price={item.price} />
        ))}
        {hasDeadline && (
          <li className={styles.item}>
            <span className={styles.itemLabel}>納期</span>
            <span className={styles.badge}>{DEADLINE_LABELS[estimate.deadlineRate]}</span>
          </li>
        )}
        {hasSupport && (
          <li className={styles.item}>
            <span className={styles.itemLabel}>保守プラン</span>
            <span className={styles.badge}>{SUPPORT_LABELS[estimate.supportPlan]}</span>
          </li>
        )}
      </ul>
    </div>
  );
}
