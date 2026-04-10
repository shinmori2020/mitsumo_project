// Excel出力（xlsx-js-style 3シート構成・スタイル付き）
import XLSX from 'xlsx-js-style';
import { formatCurrency } from '../../utils/formatCurrency';
import { buildBreakdown } from '../../utils/buildBreakdown';
import { getCompanyInfo } from '../../utils/companyInfo';
import { getNextEstimateNumber } from '../../utils/estimateNumber';

const SITE_TYPE_LABELS = { corporate: 'コーポレート', lp: 'LP', ec: 'EC', blog: 'ブログ' };
const BUILD_METHOD_LABELS = { wordpress: 'WordPress', html: 'HTML/CSS' };
const FONT_LABELS = { soft: 'やわらかい', sharp: 'シャープ', formal: 'フォーマル', casual: 'カジュアル' };
const LAYOUT_LABELS = { A: 'パターンA（ヘッダー大）', B: 'パターンB（サイドバー付）', C: 'パターンC（1カラム）', D: 'パターンD（グリッド）' };
const SUPPORT_LABELS = { none: 'なし', light: 'ライト', standard: 'スタンダード' };
const SUPPORT_PRICES = { none: 0, light: 5000, standard: 15000 };
const DEADLINE_LABELS = { 1.0: '通常', 1.3: '急ぎ（×1.3）', 1.5: '特急（×1.5）' };

function fmtDate(d) {
  return `${d.getFullYear()}年${String(d.getMonth() + 1).padStart(2, '0')}月${String(d.getDate()).padStart(2, '0')}日`;
}
function fmtDateShort(d) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

// 共通スタイル定義
const COLORS = {
  primary: '1D9E75',
  dark: '085041',
  light: 'E1F5EE',
  white: 'FFFFFF',
  gray: 'F5F5F5',
  border: 'CCCCCC',
};

const border = {
  top: { style: 'thin', color: { rgb: COLORS.border } },
  bottom: { style: 'thin', color: { rgb: COLORS.border } },
  left: { style: 'thin', color: { rgb: COLORS.border } },
  right: { style: 'thin', color: { rgb: COLORS.border } },
};

const s = {
  title: { font: { bold: true, sz: 18, color: { rgb: COLORS.dark } }, alignment: { horizontal: 'center', vertical: 'center' } },
  sectionHeader: { font: { bold: true, sz: 12, color: { rgb: COLORS.white } }, fill: { fgColor: { rgb: COLORS.primary } }, alignment: { vertical: 'center' }, border },
  tableHeader: { font: { bold: true, sz: 11, color: { rgb: COLORS.white } }, fill: { fgColor: { rgb: COLORS.primary } }, alignment: { horizontal: 'center', vertical: 'center' }, border },
  tableHeaderRight: { font: { bold: true, sz: 11, color: { rgb: COLORS.white } }, fill: { fgColor: { rgb: COLORS.primary } }, alignment: { horizontal: 'right', vertical: 'center' }, border },
  cellNormal: { font: { sz: 11 }, alignment: { vertical: 'center' }, border },
  cellRight: { font: { sz: 11 }, alignment: { horizontal: 'right', vertical: 'center' }, border },
  cellCenter: { font: { sz: 11 }, alignment: { horizontal: 'center', vertical: 'center' }, border },
  cellEven: { font: { sz: 11 }, fill: { fgColor: { rgb: COLORS.light } }, alignment: { vertical: 'center' }, border },
  cellEvenRight: { font: { sz: 11 }, fill: { fgColor: { rgb: COLORS.light } }, alignment: { horizontal: 'right', vertical: 'center' }, border },
  cellEvenCenter: { font: { sz: 11 }, fill: { fgColor: { rgb: COLORS.light } }, alignment: { horizontal: 'center', vertical: 'center' }, border },
  summaryLabel: { font: { bold: true, sz: 11 }, alignment: { horizontal: 'right', vertical: 'center' }, border },
  summaryValue: { font: { bold: true, sz: 11 }, alignment: { horizontal: 'right', vertical: 'center' }, border },
  totalLabel: { font: { bold: true, sz: 13, color: { rgb: COLORS.white } }, fill: { fgColor: { rgb: COLORS.dark } }, alignment: { horizontal: 'right', vertical: 'center' }, border },
  totalValue: { font: { bold: true, sz: 13, color: { rgb: COLORS.white } }, fill: { fgColor: { rgb: COLORS.dark } }, alignment: { horizontal: 'right', vertical: 'center' }, border },
  labelCell: { font: { bold: true, sz: 11 }, fill: { fgColor: { rgb: COLORS.light } }, alignment: { vertical: 'center' }, border },
  valueCell: { font: { sz: 11 }, alignment: { vertical: 'center', wrapText: true }, border },
  headerInfo: { font: { sz: 10, color: { rgb: '555555' } }, alignment: { horizontal: 'right', vertical: 'center' } },
  clientName: { font: { bold: true, sz: 14, color: { rgb: COLORS.dark } }, alignment: { vertical: 'center' } },
  priceBox: { font: { bold: true, sz: 16, color: { rgb: COLORS.white } }, fill: { fgColor: { rgb: COLORS.dark } }, alignment: { horizontal: 'center', vertical: 'center' }, border },
};

// セルを設定するヘルパー
function setCell(ws, r, c, value, style) {
  const addr = XLSX.utils.encode_cell({ r, c });
  ws[addr] = { v: value, t: typeof value === 'number' ? 'n' : 's', s: style };
}

// Sheet1：見積もり明細
function buildSheet1(estimate, price, estNum) {
  const items = buildBreakdown(estimate);
  const company = getCompanyInfo();
  const today = new Date();
  const expiry = new Date(today);
  expiry.setDate(expiry.getDate() + (estimate.validityDays || 30));

  const ws = {};
  let row = 0;

  // 自社情報（右寄せ）
  if (company.name) {
    setCell(ws, row, 4, company.name, s.headerInfo);
    row++;
    if (company.address) { setCell(ws, row, 4, company.address, s.headerInfo); row++; }
    if (company.tel) { setCell(ws, row, 4, `TEL: ${company.tel}`, s.headerInfo); row++; }
    if (company.email) { setCell(ws, row, 4, company.email, s.headerInfo); row++; }
    if (company.url) { setCell(ws, row, 4, company.url, s.headerInfo); row++; }
    row++;
  }

  // タイトル
  const titleRow = row;
  setCell(ws, row, 0, 'お 見 積 書', s.title);
  ws['!merges'] = [{ s: { r: titleRow, c: 0 }, e: { r: titleRow, c: 5 } }];
  row += 2;

  // ヘッダー情報
  setCell(ws, row, 0, `${estimate.clientName || '（お客様名未入力）'} 御中`, s.clientName);
  setCell(ws, row, 4, '見積日：', s.headerInfo);
  setCell(ws, row, 5, fmtDate(today), s.headerInfo);
  row++;
  setCell(ws, row, 4, '有効期限：', s.headerInfo);
  setCell(ws, row, 5, fmtDate(expiry), s.headerInfo);
  row++;
  setCell(ws, row, 4, '見積番号：', s.headerInfo);
  setCell(ws, row, 5, estNum, s.headerInfo);
  row++;
  if (estimate.desiredDeadline) {
    setCell(ws, row, 4, '納期：', s.headerInfo);
    setCell(ws, row, 5, estimate.desiredDeadline, s.headerInfo);
    row++;
  }
  row++;

  // 合計金額
  setCell(ws, row, 0, `お見積り合計金額（税込）  ¥${formatCurrency(price.total)}`, s.priceBox);
  ws['!merges'].push({ s: { r: row, c: 0 }, e: { r: row, c: 5 } });
  row += 2;

  // 明細ヘッダー
  const headerRow = row;
  setCell(ws, row, 0, 'No.', s.tableHeader);
  setCell(ws, row, 1, '項目', s.tableHeader);
  setCell(ws, row, 2, '単価', s.tableHeaderRight);
  setCell(ws, row, 3, '数量', s.tableHeader);
  setCell(ws, row, 4, '小計', s.tableHeaderRight);
  setCell(ws, row, 5, '備考', s.tableHeader);
  row++;

  // 明細行
  items.forEach((item, i) => {
    const isEven = i % 2 === 1;
    setCell(ws, row, 0, i + 1, isEven ? s.cellEvenCenter : s.cellCenter);
    setCell(ws, row, 1, item.label, isEven ? s.cellEven : s.cellNormal);
    setCell(ws, row, 2, item.unit, isEven ? s.cellEvenRight : s.cellRight);
    setCell(ws, row, 3, item.qty, isEven ? s.cellEvenCenter : s.cellCenter);
    setCell(ws, row, 4, item.unit * item.qty, isEven ? s.cellEvenRight : s.cellRight);
    setCell(ws, row, 5, '', isEven ? s.cellEven : s.cellNormal);
    row++;
  });

  row++;

  // 集計行
  setCell(ws, row, 3, '小計（税抜）', s.summaryLabel);
  setCell(ws, row, 4, '', s.summaryLabel);
  setCell(ws, row, 5, price.subtotal, s.summaryValue);
  ws['!merges'].push({ s: { r: row, c: 3 }, e: { r: row, c: 4 } });
  row++;

  if (price.deadlineAdjustment > 0) {
    setCell(ws, row, 3, `納期調整（${DEADLINE_LABELS[estimate.deadlineRate]}）`, s.summaryLabel);
    setCell(ws, row, 4, '', s.summaryLabel);
    setCell(ws, row, 5, price.deadlineAdjustment, s.summaryValue);
    ws['!merges'].push({ s: { r: row, c: 3 }, e: { r: row, c: 4 } });
    row++;
  }

  if (price.discount > 0) {
    const dLabel = estimate.discountType === 'amount' ? '値引き' : `${estimate.discountValue}%割引`;
    setCell(ws, row, 3, dLabel, s.summaryLabel);
    setCell(ws, row, 4, '', s.summaryLabel);
    setCell(ws, row, 5, -price.discount, s.summaryValue);
    ws['!merges'].push({ s: { r: row, c: 3 }, e: { r: row, c: 4 } });
    row++;
  }

  setCell(ws, row, 3, '消費税（10%）', s.summaryLabel);
  setCell(ws, row, 4, '', s.summaryLabel);
  setCell(ws, row, 5, price.tax, s.summaryValue);
  ws['!merges'].push({ s: { r: row, c: 3 }, e: { r: row, c: 4 } });
  row++;

  setCell(ws, row, 3, '合計（税込）', s.totalLabel);
  setCell(ws, row, 4, '', s.totalLabel);
  setCell(ws, row, 5, price.total, s.totalValue);
  ws['!merges'].push({ s: { r: row, c: 3 }, e: { r: row, c: 4 } });

  ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: row, c: 5 } });
  ws['!cols'] = [{ wch: 6 }, { wch: 32 }, { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 16 }];

  // 行の高さ
  ws['!rows'] = [];
  ws['!rows'][0] = { hpt: 36 };
  ws['!rows'][headerRow - 2] = { hpt: 30 };

  return ws;
}

// Sheet2：サイト仕様
function buildSheet2(estimate) {
  const topCount = estimate.topPage ? 1 : 0;
  const totalPages = topCount + estimate.subPageCount + estimate.lpPageCount;
  const ws = {};
  let row = 0;

  // タイトル
  setCell(ws, row, 0, 'サイト仕様', s.title);
  ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];
  row += 2;

  // セクション: 基本情報
  setCell(ws, row, 0, '基本情報', s.sectionHeader);
  setCell(ws, row, 1, '', s.sectionHeader);
  ws['!merges'].push({ s: { r: row, c: 0 }, e: { r: row, c: 1 } });
  row++;

  const basicInfo = [
    ['サイト種別', SITE_TYPE_LABELS[estimate.siteType]],
    ['制作方式', BUILD_METHOD_LABELS[estimate.buildMethod]],
    ['制作ページ数', `トップ${topCount}P + 下層${estimate.subPageCount}P + LP${estimate.lpPageCount}P（計${totalPages}P）`],
    ['レスポンシブ対応', estimate.responsive ? '対応する' : 'しない'],
  ];
  basicInfo.forEach(([label, val]) => {
    setCell(ws, row, 0, label, s.labelCell);
    setCell(ws, row, 1, val, s.valueCell);
    row++;
  });
  row++;

  // セクション: デザイン設定
  setCell(ws, row, 0, 'デザイン設定', s.sectionHeader);
  setCell(ws, row, 1, '', s.sectionHeader);
  ws['!merges'].push({ s: { r: row, c: 0 }, e: { r: row, c: 1 } });
  row++;

  const designInfo = [
    ['メインカラー', estimate.colorMain],
    ['サブカラー', estimate.colorSub],
    ['アクセントカラー', estimate.colorAccent],
    ['フォントの雰囲気', FONT_LABELS[estimate.fontStyle]],
    ['レイアウト', LAYOUT_LABELS[estimate.layoutPattern]],
  ];
  designInfo.forEach(([label, val]) => {
    setCell(ws, row, 0, label, s.labelCell);
    setCell(ws, row, 1, val, s.valueCell);
    row++;
  });
  row++;

  // セクション: 機能一覧
  setCell(ws, row, 0, '機能一覧', s.sectionHeader);
  setCell(ws, row, 1, '', s.sectionHeader);
  ws['!merges'].push({ s: { r: row, c: 0 }, e: { r: row, c: 1 } });
  row++;

  const features = [
    ['お問い合わせフォーム', estimate.funcForm],
    ['ブログ・新着情報', estimate.funcBlog],
    ['検索機能', estimate.funcSearch],
    ['カテゴリー絞り込み', estimate.funcFilter],
    ['ページネーション', estimate.funcPagination],
    ['パンくずリスト', estimate.funcBreadcrumb],
    ['スライダー', estimate.funcSlider],
    ['アコーディオン', estimate.funcAccordion],
    ['モーダル', estimate.funcModal],
    ['アニメーション', estimate.animLevel !== 'none' ? `あり（${estimate.animLevel === 'simple' ? 'シンプル' : 'リッチ'}）` : 'なし'],
    ['SNS連携', estimate.funcSns],
    ['Googleマップ', estimate.funcMap],
  ];
  if (estimate.buildMethod === 'wordpress') {
    features.push(['カスタムフィールド', estimate.wpAcf], ['WP管理画面', estimate.wpAdmin], ['プラグイン', estimate.wpPlugin]);
  }
  if (estimate.siteType === 'ec') {
    features.push(['EC基本構築', estimate.ecBase], ['商品ページ', estimate.ecProduct], ['カート・決済', estimate.ecCart]);
  }
  features.forEach(([name, val]) => {
    const display = typeof val === 'string' ? val : (val ? 'あり' : 'なし');
    setCell(ws, row, 0, name, s.labelCell);
    setCell(ws, row, 1, display, s.valueCell);
    row++;
  });
  row++;

  // セクション: 参考情報
  setCell(ws, row, 0, '参考情報', s.sectionHeader);
  setCell(ws, row, 1, '', s.sectionHeader);
  ws['!merges'].push({ s: { r: row, c: 0 }, e: { r: row, c: 1 } });
  row++;

  if (estimate.referenceUrl1) { setCell(ws, row, 0, '参考URL①', s.labelCell); setCell(ws, row, 1, estimate.referenceUrl1, s.valueCell); row++; }
  if (estimate.referenceUrl2) { setCell(ws, row, 0, '参考URL②', s.labelCell); setCell(ws, row, 1, estimate.referenceUrl2, s.valueCell); row++; }
  if (estimate.designNote) { setCell(ws, row, 0, 'その他要望', s.labelCell); setCell(ws, row, 1, estimate.designNote, s.valueCell); row++; }

  ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: row - 1, c: 1 } });
  ws['!cols'] = [{ wch: 22 }, { wch: 50 }];
  ws['!rows'] = [{ hpt: 32 }];

  return ws;
}

// Sheet3：備考・補足事項
function buildSheet3(estimate) {
  const ws = {};
  let row = 0;

  setCell(ws, row, 0, '備考・補足事項', s.title);
  ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];
  row += 2;

  // 注意事項
  setCell(ws, row, 0, '注意事項', s.sectionHeader);
  setCell(ws, row, 1, '', s.sectionHeader);
  ws['!merges'].push({ s: { r: row, c: 0 }, e: { r: row, c: 1 } });
  row++;

  const notes = [
    ['デザイン修正の無料回数', estimate.freeRevisions || '未設定'],
    ['追加費用について', '仕様変更・ページ追加が発生した場合は別途お見積り'],
    ['素材について', '写真・テキスト等の素材はお客様にご用意いただきます'],
    ['著作権', '制作物の著作権は納品・全額入金後にお客様へ譲渡'],
  ];
  notes.forEach(([label, val]) => {
    setCell(ws, row, 0, label, s.labelCell);
    setCell(ws, row, 1, val, s.valueCell);
    row++;
  });
  row++;

  // 保守
  setCell(ws, row, 0, '保守・運用サポート', s.sectionHeader);
  setCell(ws, row, 1, '', s.sectionHeader);
  ws['!merges'].push({ s: { r: row, c: 0 }, e: { r: row, c: 1 } });
  row++;

  setCell(ws, row, 0, '選択プラン', s.labelCell);
  setCell(ws, row, 1, SUPPORT_LABELS[estimate.supportPlan], s.valueCell);
  row++;
  if (estimate.supportPlan !== 'none') {
    setCell(ws, row, 0, '月額料金', s.labelCell);
    setCell(ws, row, 1, `${formatCurrency(SUPPORT_PRICES[estimate.supportPlan])}円/月`, s.valueCell);
    row++;
  }
  row++;

  // 支払い条件
  setCell(ws, row, 0, '支払い条件・方法', s.sectionHeader);
  setCell(ws, row, 1, '', s.sectionHeader);
  ws['!merges'].push({ s: { r: row, c: 0 }, e: { r: row, c: 1 } });
  row++;

  const payments = [
    ['支払いタイミング', estimate.paymentTiming || '未設定'],
    ['支払い方法', estimate.paymentMethod || '未設定'],
  ];
  payments.forEach(([label, val]) => {
    setCell(ws, row, 0, label, s.labelCell);
    setCell(ws, row, 1, val, s.valueCell);
    row++;
  });

  if (estimate.otherNote) {
    row++;
    setCell(ws, row, 0, 'その他備考', s.sectionHeader);
    setCell(ws, row, 1, '', s.sectionHeader);
    ws['!merges'].push({ s: { r: row, c: 0 }, e: { r: row, c: 1 } });
    row++;
    setCell(ws, row, 0, estimate.otherNote, s.valueCell);
    setCell(ws, row, 1, '', s.valueCell);
    ws['!merges'].push({ s: { r: row, c: 0 }, e: { r: row, c: 1 } });
    row++;
  }

  ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: row - 1, c: 1 } });
  ws['!cols'] = [{ wch: 22 }, { wch: 50 }];
  ws['!rows'] = [{ hpt: 32 }];

  return ws;
}

// Excel出力実行
export function exportExcel(estimate, price) {
  const wb = XLSX.utils.book_new();
  const estNum = getNextEstimateNumber();

  XLSX.utils.book_append_sheet(wb, buildSheet1(estimate, price, estNum), '見積もり明細');
  XLSX.utils.book_append_sheet(wb, buildSheet2(estimate), 'サイト仕様');
  XLSX.utils.book_append_sheet(wb, buildSheet3(estimate), '備考・補足事項');

  const clientName = estimate.clientName || '未設定';
  const fileName = `MitsuMO_見積書_${clientName}_${fmtDateShort(new Date())}.xlsx`;

  XLSX.writeFile(wb, fileName);
}
