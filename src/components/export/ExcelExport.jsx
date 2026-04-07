// Excel出力（SheetJS 3シート構成）
import * as XLSX from 'xlsx';
import { formatCurrency } from '../../utils/formatCurrency';
import { buildBreakdown } from '../../utils/buildBreakdown';

const SITE_TYPE_LABELS = { corporate: 'コーポレート', lp: 'LP', ec: 'EC', blog: 'ブログ' };
const BUILD_METHOD_LABELS = { wordpress: 'WordPress', html: 'HTML/CSS' };
const FONT_LABELS = { soft: 'やわらかい', sharp: 'シャープ', formal: 'フォーマル', casual: 'カジュアル' };
const LAYOUT_LABELS = { A: 'パターンA（ヘッダー大・写真メイン）', B: 'パターンB（サイドバー付）', C: 'パターンC（1カラム）', D: 'パターンD（グリッド）' };
const SUPPORT_LABELS = { none: 'なし', light: 'ライト', standard: 'スタンダード' };
const SUPPORT_PRICES = { none: 0, light: 5000, standard: 15000 };
const DEADLINE_LABELS = { 1.0: '通常', 1.3: '急ぎ（×1.3）', 1.5: '特急（×1.5）' };

function formatDate(d) {
  return `${d.getFullYear()}年${String(d.getMonth() + 1).padStart(2, '0')}月${String(d.getDate()).padStart(2, '0')}日`;
}

function formatDateShort(d) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

// Sheet1：見積もり明細
function buildSheet1(estimate, price) {
  const items = buildBreakdown(estimate);
  const today = new Date();
  const expiry = new Date(today);
  expiry.setDate(expiry.getDate() + 30);
  const estNum = `EST-${today.getFullYear()}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`;

  const rows = [];

  // ヘッダーエリア
  rows.push(['', '', 'お 見 積 書', '', '', '']);
  rows.push([]);
  rows.push([`${estimate.clientName || '（お客様名未入力）'} 御中`, '', '', '', '見積日：', formatDate(today)]);
  rows.push(['', '', '', '', '有効期限：', formatDate(expiry)]);
  rows.push(['', '', '', '', '見積番号：', estNum]);
  if (estimate.desiredDeadline) {
    rows.push(['', '', '', '', '納期：', estimate.desiredDeadline]);
  }
  rows.push([]);

  // 合計金額
  rows.push(['お見積り合計金額（税込）', '', '', '', `¥${formatCurrency(price.total)}`, '']);
  rows.push([]);

  // 明細ヘッダー
  rows.push(['No.', '項目', '単価', '数量', '小計', '備考']);

  // 明細行
  items.forEach((item, i) => {
    rows.push([i + 1, item.label, item.unit, item.qty, item.unit * item.qty, '']);
  });

  rows.push([]);

  // 集計行
  rows.push(['', '', '', '', '小計（税抜）', price.subtotal]);
  if (price.deadlineAdjustment > 0) {
    rows.push(['', '', '', '', `納期調整（${DEADLINE_LABELS[estimate.deadlineRate]}）`, price.deadlineAdjustment]);
  }
  if (price.discount > 0) {
    const discountLabel = estimate.discountType === 'amount'
      ? '値引き'
      : `${estimate.discountValue}%割引`;
    rows.push(['', '', '', '', discountLabel, -price.discount]);
  }
  rows.push(['', '', '', '', '消費税（10%）', price.tax]);
  rows.push(['', '', '', '', '合計（税込）', price.total]);

  const ws = XLSX.utils.aoa_to_sheet(rows);

  ws['!cols'] = [
    { wch: 6 },
    { wch: 32 },
    { wch: 14 },
    { wch: 10 },
    { wch: 18 },
    { wch: 24 },
  ];

  return ws;
}

// Sheet2：サイト仕様
function buildSheet2(estimate) {
  const topCount = estimate.topPage ? 1 : 0;
  const totalPages = topCount + estimate.subPageCount + estimate.lpPageCount;

  const rows = [];

  rows.push(['サイト仕様']);
  rows.push([]);

  // 基本情報
  rows.push(['【基本情報】']);
  rows.push(['サイト種別', SITE_TYPE_LABELS[estimate.siteType]]);
  rows.push(['制作方式', BUILD_METHOD_LABELS[estimate.buildMethod]]);
  rows.push(['制作ページ数', `トップ${topCount}P + 下層${estimate.subPageCount}P + LP${estimate.lpPageCount}P（計${totalPages}ページ）`]);
  rows.push(['レスポンシブ対応', estimate.responsive ? '対応する' : 'しない']);
  rows.push([]);

  // デザイン設定
  rows.push(['【デザイン設定】']);
  rows.push(['メインカラー', estimate.colorMain]);
  rows.push(['サブカラー', estimate.colorSub]);
  rows.push(['アクセントカラー', estimate.colorAccent]);
  rows.push(['フォントの雰囲気', FONT_LABELS[estimate.fontStyle]]);
  rows.push(['レイアウト', LAYOUT_LABELS[estimate.layoutPattern]]);
  rows.push([]);

  // 機能一覧
  rows.push(['【機能一覧】']);
  const features = [
    ['お問い合わせフォーム', estimate.funcForm],
    ['ブログ・新着情報', estimate.funcBlog],
    ['検索機能', estimate.funcSearch],
    ['カテゴリー・タグ絞り込み', estimate.funcFilter],
    ['ページネーション', estimate.funcPagination],
    ['パンくずリスト', estimate.funcBreadcrumb],
    ['スライダー・カルーセル', estimate.funcSlider],
    ['アコーディオン・タブ', estimate.funcAccordion],
    ['モーダル', estimate.funcModal],
    ['アニメーション', estimate.animLevel !== 'none' ? `あり（${estimate.animLevel === 'simple' ? 'シンプル' : 'リッチ'}）` : 'なし'],
    ['SNS連携', estimate.funcSns],
    ['Googleマップ', estimate.funcMap],
  ];
  if (estimate.buildMethod === 'wordpress') {
    features.push(
      ['カスタムフィールド', estimate.wpAcf],
      ['WP管理画面カスタマイズ', estimate.wpAdmin],
      ['プラグインセットアップ', estimate.wpPlugin],
    );
  }
  if (estimate.siteType === 'ec') {
    features.push(
      ['EC基本構築', estimate.ecBase],
      ['商品ページテンプレート', estimate.ecProduct],
      ['カート・決済連携', estimate.ecCart],
    );
  }
  features.forEach(([name, val]) => {
    const display = typeof val === 'string' ? val : (val ? 'あり' : 'なし');
    rows.push([name, display]);
  });
  rows.push([]);

  // 参考情報
  rows.push(['【参考情報】']);
  rows.push(['レイアウトイメージ', LAYOUT_LABELS[estimate.layoutPattern]]);
  if (estimate.referenceUrl1) rows.push(['参考サイトURL①', estimate.referenceUrl1]);
  if (estimate.referenceUrl2) rows.push(['参考サイトURL②', estimate.referenceUrl2]);
  if (estimate.designNote) rows.push(['その他要望', estimate.designNote]);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 24 }, { wch: 50 }];

  return ws;
}

// Sheet3：備考・補足事項
function buildSheet3(estimate) {
  const rows = [];

  rows.push(['備考・補足事項']);
  rows.push([]);

  // 自由記述メモ
  rows.push(['【メモ】']);
  rows.push([estimate.otherNote || '（なし）']);
  rows.push([]);

  // 注意事項
  rows.push(['【注意事項】']);
  rows.push(['デザイン修正の無料回数', estimate.freeRevisions || '未設定']);
  rows.push(['追加費用について', '仕様変更・ページ追加が発生した場合は別途お見積り']);
  rows.push(['素材について', '写真・テキスト等の素材はお客様にご用意いただきます']);
  rows.push(['著作権', '制作物の著作権は納品・全額入金後にお客様へ譲渡']);
  rows.push([]);

  // 保守・運用サポート
  rows.push(['【保守・運用サポート】']);
  rows.push(['選択プラン', SUPPORT_LABELS[estimate.supportPlan]]);
  if (estimate.supportPlan !== 'none') {
    rows.push(['月額料金', `${formatCurrency(SUPPORT_PRICES[estimate.supportPlan])}円/月`]);
  }
  rows.push([]);

  // 支払い条件
  rows.push(['【支払い条件・方法】']);
  rows.push(['支払いタイミング', estimate.paymentTiming || '未設定']);
  rows.push(['支払い方法', estimate.paymentMethod || '未設定']);
  if (estimate.otherNote) {
    rows.push(['その他備考', estimate.otherNote]);
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 24 }, { wch: 50 }];

  return ws;
}

// Excel出力実行
export function exportExcel(estimate, price) {
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, buildSheet1(estimate, price), '見積もり明細');
  XLSX.utils.book_append_sheet(wb, buildSheet2(estimate), 'サイト仕様');
  XLSX.utils.book_append_sheet(wb, buildSheet3(estimate), '備考・補足事項');

  const clientName = estimate.clientName || '未設定';
  const fileName = `MitsuMO_見積書_${clientName}_${formatDateShort(new Date())}.xlsx`;

  XLSX.writeFile(wb, fileName);
}
