// Excel出力（xlsx-js-style 3シート構成・構造化）
import XLSX from 'xlsx-js-style';
import { formatCurrency } from '../../utils/formatCurrency';
import { buildBreakdown } from '../../utils/buildBreakdown';
import { getCompanyInfo } from '../../utils/companyInfo';
import { getNextEstimateNumber } from '../../utils/estimateNumber';
import {
  S, setCell, addSection, addInfoRow, addInfoRows, addTableHeader,
  addCategoryRow, addDetailRow, addSummaryRow, finalizeSheet,
} from './excelHelpers';

const LABELS = {
  siteType: { corporate: 'コーポレート', lp: 'LP', ec: 'EC', blog: 'ブログ' },
  buildMethod: { wordpress: 'WordPress', html: 'HTML/CSS' },
  font: { soft: 'やわらかい', sharp: 'シャープ', formal: 'フォーマル', casual: 'カジュアル' },
  layout: { A: 'パターンA（ヘッダー大）', B: 'パターンB（サイドバー付）', C: 'パターンC（1カラム）', D: 'パターンD（グリッド）' },
  support: { none: 'なし', light: 'ライト', standard: 'スタンダード' },
  supportPrice: { none: 0, light: 5000, standard: 15000 },
  deadline: { 1.0: '通常', 1.3: '急ぎ（×1.3）', 1.5: '特急（×1.5）' },
};

function fmtDate(d) {
  return `${d.getFullYear()}年${String(d.getMonth() + 1).padStart(2, '0')}月${String(d.getDate()).padStart(2, '0')}日`;
}
function fmtDateShort(d) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

// Sheet1：見積もり明細
function buildSheet1(estimate, price, estNum) {
  const items = buildBreakdown(estimate);
  const company = getCompanyInfo();
  const today = new Date();
  const expiry = new Date(today);
  expiry.setDate(expiry.getDate() + (estimate.validityDays || 30));

  const ws = {};
  const merges = [];
  let row = 0;

  // 自社情報
  if (company.name) {
    setCell(ws, row, 4, company.name, S.headerInfo); row++;
    if (company.address) { setCell(ws, row, 4, company.address, S.headerInfo); row++; }
    if (company.tel) { setCell(ws, row, 4, `TEL: ${company.tel}`, S.headerInfo); row++; }
    if (company.email) { setCell(ws, row, 4, company.email, S.headerInfo); row++; }
    if (company.url) { setCell(ws, row, 4, company.url, S.headerInfo); row++; }
    row++;
  }

  // タイトル
  const titleRow = row;
  setCell(ws, row, 0, 'お 見 積 書', S.title);
  merges.push({ s: { r: titleRow, c: 0 }, e: { r: titleRow, c: 5 } });
  row += 2;

  // ヘッダー情報
  setCell(ws, row, 0, `${estimate.clientName || '（お客様名未入力）'} 御中`, S.clientName);
  setCell(ws, row, 4, '見積日：', S.headerInfo); setCell(ws, row, 5, fmtDate(today), S.headerInfo); row++;
  setCell(ws, row, 4, '有効期限：', S.headerInfo); setCell(ws, row, 5, fmtDate(expiry), S.headerInfo); row++;
  setCell(ws, row, 4, '見積番号：', S.headerInfo); setCell(ws, row, 5, estNum, S.headerInfo); row++;
  if (estimate.desiredDeadline) {
    setCell(ws, row, 4, '納期：', S.headerInfo); setCell(ws, row, 5, estimate.desiredDeadline, S.headerInfo); row++;
  }
  row++;

  // 合計金額
  setCell(ws, row, 0, `お見積り合計金額（税込）  ¥${formatCurrency(price.total)}`, S.priceBox);
  merges.push({ s: { r: row, c: 0 }, e: { r: row, c: 5 } });
  row += 2;

  // 明細テーブル
  row = addTableHeader(ws, row);

  // カテゴリ付き明細行
  let lastCategory = '';
  let dataIndex = 0;
  items.forEach((item) => {
    if (item.category !== lastCategory) {
      lastCategory = item.category;
      row = addCategoryRow(ws, row, item.category, merges);
    }
    row = addDetailRow(ws, row, dataIndex, item, dataIndex % 2 === 1);
    dataIndex++;
  });
  row++;

  // 集計行
  row = addSummaryRow(ws, row, '小計（税抜）', price.subtotal, merges);
  if (price.deadlineAdjustment > 0) {
    row = addSummaryRow(ws, row, `納期調整（${LABELS.deadline[estimate.deadlineRate]}）`, price.deadlineAdjustment, merges);
  }
  if (price.discount > 0) {
    const dLabel = estimate.discountType === 'amount' ? '値引き' : `${estimate.discountValue}%割引`;
    row = addSummaryRow(ws, row, dLabel, -price.discount, merges);
  }
  row = addSummaryRow(ws, row, '消費税（10%）', price.tax, merges);
  row = addSummaryRow(ws, row, '合計（税込）', price.total, merges, true);

  ws['!merges'] = merges;
  const rows = [];
  rows[titleRow] = { hpt: 36 };
  return finalizeSheet(ws, row - 1, 5,
    [{ wch: 6 }, { wch: 32 }, { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 16 }],
    rows
  );
}

// Sheet2：サイト仕様
function buildSheet2(estimate) {
  const topCount = estimate.topPage ? 1 : 0;
  const totalPages = topCount + estimate.subPageCount + estimate.lpPageCount;
  const ws = {};
  const merges = [];
  let row = 0;

  setCell(ws, row, 0, 'サイト仕様', S.title);
  merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } });
  row += 2;

  row = addSection(ws, row, '基本情報', merges);
  row = addInfoRows(ws, row, [
    ['サイト種別', LABELS.siteType[estimate.siteType]],
    ['制作方式', LABELS.buildMethod[estimate.buildMethod]],
    ['制作ページ数', `トップ${topCount}P + 下層${estimate.subPageCount}P + LP${estimate.lpPageCount}P（計${totalPages}P）`],
    ['レスポンシブ対応', estimate.responsive ? '対応する' : 'しない'],
  ]);
  row++;

  row = addSection(ws, row, 'デザイン設定', merges);
  row = addInfoRows(ws, row, [
    ['メインカラー', estimate.colorMain],
    ['サブカラー', estimate.colorSub],
    ['アクセントカラー', estimate.colorAccent],
    ['フォントの雰囲気', LABELS.font[estimate.fontStyle]],
    ['レイアウト', LABELS.layout[estimate.layoutPattern]],
  ]);
  row++;

  row = addSection(ws, row, '機能一覧', merges);
  const features = [
    ['お問い合わせフォーム', estimate.funcForm], ['ブログ・新着情報', estimate.funcBlog],
    ['検索機能', estimate.funcSearch], ['カテゴリー絞り込み', estimate.funcFilter],
    ['ページネーション', estimate.funcPagination], ['パンくずリスト', estimate.funcBreadcrumb],
    ['スライダー', estimate.funcSlider], ['アコーディオン', estimate.funcAccordion],
    ['モーダル', estimate.funcModal],
    ['アニメーション', estimate.animLevel !== 'none' ? `あり（${estimate.animLevel === 'simple' ? 'シンプル' : 'リッチ'}）` : 'なし'],
    ['SNS連携', estimate.funcSns], ['Googleマップ', estimate.funcMap],
  ];
  if (estimate.buildMethod === 'wordpress') features.push(['カスタムフィールド', estimate.wpAcf], ['WP管理画面', estimate.wpAdmin], ['プラグイン', estimate.wpPlugin]);
  if (estimate.siteType === 'ec') features.push(['EC基本構築', estimate.ecBase], ['商品ページ', estimate.ecProduct], ['カート・決済', estimate.ecCart]);
  features.forEach(([name, val]) => {
    row = addInfoRow(ws, row, name, typeof val === 'string' ? val : (val ? 'あり' : 'なし'));
  });
  row++;

  row = addSection(ws, row, '参考情報', merges);
  if (estimate.referenceUrl1) row = addInfoRow(ws, row, '参考URL①', estimate.referenceUrl1);
  if (estimate.referenceUrl2) row = addInfoRow(ws, row, '参考URL②', estimate.referenceUrl2);
  if (estimate.designNote) row = addInfoRow(ws, row, 'その他要望', estimate.designNote);

  ws['!merges'] = merges;
  return finalizeSheet(ws, row - 1, 1, [{ wch: 22 }, { wch: 50 }], [{ hpt: 32 }]);
}

// Sheet3：備考・補足事項
function buildSheet3(estimate) {
  const ws = {};
  const merges = [];
  let row = 0;

  setCell(ws, row, 0, '備考・補足事項', S.title);
  merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } });
  row += 2;

  row = addSection(ws, row, '注意事項', merges);
  row = addInfoRows(ws, row, [
    ['デザイン修正の無料回数', estimate.freeRevisions || '未設定'],
    ['追加費用について', '仕様変更・ページ追加が発生した場合は別途お見積り'],
    ['素材について', '写真・テキスト等の素材はお客様にご用意いただきます'],
    ['著作権', '制作物の著作権は納品・全額入金後にお客様へ譲渡'],
  ]);
  row++;

  row = addSection(ws, row, '保守・運用サポート', merges);
  row = addInfoRow(ws, row, '選択プラン', LABELS.support[estimate.supportPlan]);
  if (estimate.supportPlan !== 'none') {
    row = addInfoRow(ws, row, '月額料金', `${formatCurrency(LABELS.supportPrice[estimate.supportPlan])}円/月`);
  }
  row++;

  row = addSection(ws, row, '支払い条件・方法', merges);
  row = addInfoRows(ws, row, [
    ['支払いタイミング', estimate.paymentTiming || '未設定'],
    ['支払い方法', estimate.paymentMethod || '未設定'],
  ]);

  if (estimate.otherNote) {
    row++;
    row = addSection(ws, row, 'その他備考', merges);
    setCell(ws, row, 0, estimate.otherNote, S.valueCell);
    setCell(ws, row, 1, '', S.valueCell);
    merges.push({ s: { r: row, c: 0 }, e: { r: row, c: 1 } });
    row++;
  }

  ws['!merges'] = merges;
  return finalizeSheet(ws, row - 1, 1, [{ wch: 22 }, { wch: 50 }], [{ hpt: 32 }]);
}

// Excel出力実行
export function exportExcel(estimate, price) {
  const wb = XLSX.utils.book_new();
  const estNum = getNextEstimateNumber();

  XLSX.utils.book_append_sheet(wb, buildSheet1(estimate, price, estNum), '見積もり明細');
  XLSX.utils.book_append_sheet(wb, buildSheet2(estimate), 'サイト仕様');
  XLSX.utils.book_append_sheet(wb, buildSheet3(estimate), '備考・補足事項');

  const fileName = `MitsuMO_見積書_${estimate.clientName || '未設定'}_${fmtDateShort(new Date())}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
