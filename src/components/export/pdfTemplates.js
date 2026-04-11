// PDF出力用HTMLテンプレート（構造化）
import { formatCurrency } from '../../utils/formatCurrency';
import { SITE_TYPE_LABELS, BUILD_METHOD_LABELS, FONT_LABELS, LAYOUT_LABELS, SUPPORT_LABELS_WITH_PRICE, DEADLINE_LABELS } from '../../data/labels';

// 共通スタイル
const S = {
  page: `width:780px;font-family:'Noto Sans JP',sans-serif;color:#333;padding:40px;background:#fff;`,
  h1: `text-align:center;font-size:24px;color:#085041;letter-spacing:8px;margin-bottom:24px`,
  h2: `font-size:18px;color:#085041;border-bottom:2px solid #1D9E75;padding-bottom:8px;margin-bottom:20px`,
  h3: `font-size:14px;color:#1D9E75;margin:16px 0 8px`,
  priceBox: `background:#085041;color:#fff;padding:16px;border-radius:8px;text-align:center;margin-bottom:24px`,
  thStyle: `padding:8px;border:1px solid #1D9E75`,
  tdNormal: `padding:6px 8px;border:1px solid #ddd`,
  tdLabel: `padding:8px 10px;border:1px solid #ddd;background:#f0f8f4;width:160px;font-weight:bold`,
  tdValue: `padding:8px 10px;border:1px solid #ddd`,
  infoRight: `text-align:right;font-size:12px;color:#555`,
  companyInfo: `text-align:right;font-size:11px;color:#555;margin-bottom:16px;line-height:1.8`,
};

// テーブルヘッダー
export function tableHead() {
  return `<thead><tr style="background:#1D9E75;color:#fff">
    <th style="${S.thStyle};width:40px">No.</th>
    <th style="${S.thStyle};text-align:left">項目</th>
    <th style="${S.thStyle};text-align:right;width:100px">単価</th>
    <th style="${S.thStyle};width:50px">数量</th>
    <th style="${S.thStyle};text-align:right;width:110px">小計</th>
  </tr></thead>`;
}

// 明細行
export function detailRow(item, index) {
  const bg = index % 2 === 1 ? '#f0f8f4' : '#fff';
  return `<tr style="background:${bg}">
    <td style="${S.tdNormal};text-align:center">${index + 1}</td>
    <td style="${S.tdNormal}">${item.label}</td>
    <td style="${S.tdNormal};text-align:right">¥${formatCurrency(item.unit)}</td>
    <td style="${S.tdNormal};text-align:center">${item.qty}</td>
    <td style="${S.tdNormal};text-align:right">¥${formatCurrency(item.unit * item.qty)}</td>
  </tr>`;
}

// カテゴリヘッダー行
export function categoryRow(label) {
  return `<tr><td colspan="5" style="padding:4px 8px;background:#5DCAA5;color:#fff;font-size:11px;font-weight:bold;border:1px solid #5DCAA5">${label}</td></tr>`;
}

// カテゴリ付き明細行群を生成
export function detailRowsWithCategories(items) {
  let lastCategory = '';
  let index = 0;
  return items.map((item) => {
    let html = '';
    if (item.category && item.category !== lastCategory) {
      lastCategory = item.category;
      html += categoryRow(item.category);
    }
    html += detailRow(item, index);
    index++;
    return html;
  }).join('');
}

// 集計行
export function summaryRows(estimate, price) {
  const rows = [];
  rows.push(summaryLine('小計（税抜）', `¥${formatCurrency(price.subtotal)}`, true));
  if (price.deadlineAdjustment > 0) {
    rows.push(summaryLine(`納期調整（${DEADLINE_LABELS[estimate.deadlineRate]}）`, `+¥${formatCurrency(price.deadlineAdjustment)}`));
  }
  if (price.discount > 0) {
    const label = estimate.discountType === 'amount' ? '値引き' : `${estimate.discountValue}%割引`;
    rows.push(summaryLine(label, `-¥${formatCurrency(price.discount)}`));
  }
  rows.push(summaryLine('消費税（10%）', `¥${formatCurrency(price.tax)}`));
  rows.push(`<tr style="background:#085041;color:#fff">
    <td colspan="4" style="padding:8px;border:1px solid #085041;text-align:right;font-weight:bold;font-size:14px">合計（税込）</td>
    <td style="padding:8px;border:1px solid #085041;text-align:right;font-weight:bold;font-size:14px">¥${formatCurrency(price.total)}</td>
  </tr>`);
  return rows.join('');
}

function summaryLine(label, value, bold = false) {
  const fw = bold ? 'font-weight:bold;' : '';
  return `<tr>
    <td colspan="4" style="${S.tdNormal};text-align:right;${fw}">${label}</td>
    <td style="${S.tdNormal};text-align:right">${value}</td>
  </tr>`;
}

// 自社情報ヘッダー
export function companyHeader(company) {
  if (!company.name) return '';
  const lines = [
    `<div style="font-size:13px;font-weight:bold;color:#085041">${company.name}</div>`,
    company.address && `<div>${company.address}</div>`,
    company.tel && `<div>TEL: ${company.tel}</div>`,
    company.email && `<div>${company.email}</div>`,
    company.url && `<div>${company.url}</div>`,
  ].filter(Boolean).join('');
  return `<div style="${S.companyInfo}">${lines}</div>`;
}

// 情報テーブル行
export function infoRow(label, value) {
  return `<tr><td style="${S.tdLabel}">${label}</td><td style="${S.tdValue}">${value}</td></tr>`;
}

// カラースウォッチ付き行
export function colorRow(label, color) {
  return `<tr><td style="${S.tdLabel}">${label}</td><td style="${S.tdValue}"><span style="display:inline-block;width:14px;height:14px;background:${color};border-radius:3px;vertical-align:middle;margin-right:6px"></span>${color}</td></tr>`;
}

// ページラッパー
export function page(content) {
  return `<div style="${S.page}">${content}</div>`;
}

// セクション見出し
export function heading1(text) {
  return `<h1 style="${S.h1}">${text}</h1>`;
}

export function heading2(text) {
  return `<h2 style="${S.h2}">${text}</h2>`;
}

export function heading3(text) {
  return `<h3 style="${S.h3}">${text}</h3>`;
}

// 合計金額ボックス
export function priceBox(total) {
  return `<div style="${S.priceBox}">
    <div style="font-size:12px;color:#9FE1CB">お見積り合計金額（税込）</div>
    <div style="font-size:32px;font-weight:bold">¥${formatCurrency(total)}</div>
  </div>`;
}

// テーブルラッパー
export function table(content) {
  return `<table style="width:100%;border-collapse:collapse;font-size:12px">${content}</table>`;
}

export function infoTable(content) {
  return `<table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:20px">${content}</table>`;
}

// ヘッダー情報（右寄せ）
export function headerInfo(lines) {
  return `<div style="${S.infoRight}">${lines.filter(Boolean).map(l => `<div>${l}</div>`).join('')}</div>`;
}
