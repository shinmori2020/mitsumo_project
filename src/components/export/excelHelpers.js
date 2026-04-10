// Excel出力用ヘルパー関数
import XLSX from 'xlsx-js-style';

// カラー定義
export const COLORS = {
  primary: '1D9E75',
  primaryMid: '5DCAA5',
  dark: '085041',
  light: 'E1F5EE',
  white: 'FFFFFF',
  gray: 'F9F9F9',
  border: 'CCCCCC',
};

const border = {
  top: { style: 'thin', color: { rgb: COLORS.border } },
  bottom: { style: 'thin', color: { rgb: COLORS.border } },
  left: { style: 'thin', color: { rgb: COLORS.border } },
  right: { style: 'thin', color: { rgb: COLORS.border } },
};

// スタイル定義
export const S = {
  title: { font: { bold: true, sz: 18, color: { rgb: COLORS.dark } }, alignment: { horizontal: 'center', vertical: 'center' } },
  sectionHeader: { font: { bold: true, sz: 12, color: { rgb: COLORS.white } }, fill: { fgColor: { rgb: COLORS.primary } }, alignment: { vertical: 'center' }, border },
  tableHeader: { font: { bold: true, sz: 11, color: { rgb: COLORS.white } }, fill: { fgColor: { rgb: COLORS.primary } }, alignment: { horizontal: 'center', vertical: 'center' }, border },
  tableHeaderRight: { font: { bold: true, sz: 11, color: { rgb: COLORS.white } }, fill: { fgColor: { rgb: COLORS.primary } }, alignment: { horizontal: 'right', vertical: 'center' }, border },
  categoryHeader: { font: { bold: true, sz: 10, color: { rgb: COLORS.white } }, fill: { fgColor: { rgb: COLORS.primaryMid } }, alignment: { vertical: 'center' }, border },
  cellNormal: { font: { sz: 11 }, alignment: { vertical: 'center' }, border },
  cellRight: { font: { sz: 11 }, alignment: { horizontal: 'right', vertical: 'center' }, border },
  cellCenter: { font: { sz: 11 }, alignment: { horizontal: 'center', vertical: 'center' }, border },
  cellEven: { font: { sz: 11 }, fill: { fgColor: { rgb: COLORS.gray } }, alignment: { vertical: 'center' }, border },
  cellEvenRight: { font: { sz: 11 }, fill: { fgColor: { rgb: COLORS.gray } }, alignment: { horizontal: 'right', vertical: 'center' }, border },
  cellEvenCenter: { font: { sz: 11 }, fill: { fgColor: { rgb: COLORS.gray } }, alignment: { horizontal: 'center', vertical: 'center' }, border },
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

// セルを設定
export function setCell(ws, r, c, value, style) {
  const addr = XLSX.utils.encode_cell({ r, c });
  ws[addr] = { v: value, t: typeof value === 'number' ? 'n' : 's', s: style };
}

// セクションヘッダー行（2カラムシート用）
export function addSection(ws, row, label, merges) {
  setCell(ws, row, 0, label, S.sectionHeader);
  setCell(ws, row, 1, '', S.sectionHeader);
  merges.push({ s: { r: row, c: 0 }, e: { r: row, c: 1 } });
  return row + 1;
}

// ラベル+値の行（2カラムシート用）
export function addInfoRow(ws, row, label, value) {
  setCell(ws, row, 0, label, S.labelCell);
  setCell(ws, row, 1, value, S.valueCell);
  return row + 1;
}

// 複数のラベル+値を一括追加
export function addInfoRows(ws, row, pairs) {
  pairs.forEach(([label, val]) => {
    row = addInfoRow(ws, row, label, val);
  });
  return row;
}

// 明細テーブルヘッダー
export function addTableHeader(ws, row) {
  setCell(ws, row, 0, 'No.', S.tableHeader);
  setCell(ws, row, 1, '項目', S.tableHeader);
  setCell(ws, row, 2, '単価', S.tableHeaderRight);
  setCell(ws, row, 3, '数量', S.tableHeader);
  setCell(ws, row, 4, '小計', S.tableHeaderRight);
  setCell(ws, row, 5, '備考', S.tableHeader);
  return row + 1;
}

// カテゴリヘッダー行（6カラムシート用）
export function addCategoryRow(ws, row, label, merges) {
  setCell(ws, row, 0, label, S.categoryHeader);
  for (let c = 1; c <= 5; c++) setCell(ws, row, c, '', S.categoryHeader);
  merges.push({ s: { r: row, c: 0 }, e: { r: row, c: 5 } });
  return row + 1;
}

// 明細データ行
export function addDetailRow(ws, row, index, item, isEven) {
  setCell(ws, row, 0, index + 1, isEven ? S.cellEvenCenter : S.cellCenter);
  setCell(ws, row, 1, item.label, isEven ? S.cellEven : S.cellNormal);
  setCell(ws, row, 2, item.unit, isEven ? S.cellEvenRight : S.cellRight);
  setCell(ws, row, 3, item.qty, isEven ? S.cellEvenCenter : S.cellCenter);
  setCell(ws, row, 4, item.unit * item.qty, isEven ? S.cellEvenRight : S.cellRight);
  setCell(ws, row, 5, '', isEven ? S.cellEven : S.cellNormal);
  return row + 1;
}

// 集計行（結合セル付き）
export function addSummaryRow(ws, row, label, value, merges, isTotal = false) {
  const ls = isTotal ? S.totalLabel : S.summaryLabel;
  const vs = isTotal ? S.totalValue : S.summaryValue;
  setCell(ws, row, 3, label, ls);
  setCell(ws, row, 4, '', ls);
  setCell(ws, row, 5, value, vs);
  merges.push({ s: { r: row, c: 3 }, e: { r: row, c: 4 } });
  return row + 1;
}

// シートの範囲と列幅を設定
export function finalizeSheet(ws, maxRow, maxCol, cols, rows) {
  ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: maxRow, c: maxCol } });
  ws['!cols'] = cols;
  if (rows) ws['!rows'] = rows;
  return ws;
}
