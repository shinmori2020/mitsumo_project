// PDF出力（html2canvas + jsPDF、ページ別キャプチャ・明細自動分割）
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { buildBreakdown } from '../../utils/buildBreakdown';
import { getCompanyInfo } from '../../utils/companyInfo';
import { getNextEstimateNumber } from '../../utils/estimateNumber';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  page, heading1, heading2, heading3, priceBox,
  table, infoTable, tableHead, detailRowsWithCategories, summaryRows,
  companyHeader, headerInfo, infoRow, colorRow,
} from './pdfTemplates';
import { SITE_TYPE_LABELS, BUILD_METHOD_LABELS, FONT_LABELS, LAYOUT_LABELS, SUPPORT_LABELS_WITH_PRICE, DEADLINE_LABELS } from '../../data/labels';

function fmtDate(d) {
  return `${d.getFullYear()}年${String(d.getMonth() + 1).padStart(2, '0')}月${String(d.getDate()).padStart(2, '0')}日`;
}
function fmtDateShort(d) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

const ROWS_FIRST_PAGE = 18;
const ROWS_CONTINUATION = 28;

// 明細ページ群を生成
function buildDetailPages(estimate, price, estNum, validityDays) {
  const items = buildBreakdown(estimate);
  const company = getCompanyInfo();
  const today = new Date();
  const expiry = new Date(today);
  expiry.setDate(expiry.getDate() + (validityDays || 30));

  const pages = [];
  let currentIndex = 0;

  // 1ページ目
  const firstItems = items.slice(0, ROWS_FIRST_PAGE);
  const isLast = items.length <= ROWS_FIRST_PAGE;
  const clientLabel = estimate.clientName || '（お客様名未入力）';

  pages.push(page([
    companyHeader(company),
    heading1('お 見 積 書'),
    `<div style="display:flex;justify-content:space-between;margin-bottom:20px">
      <div><span style="font-size:16px;font-weight:bold;color:#085041">${clientLabel} 御中</span></div>`,
    headerInfo([
      `見積日：${fmtDate(today)}`,
      `有効期限：${fmtDate(expiry)}`,
      `見積番号：${estNum}`,
      estimate.desiredDeadline && `納期：${estimate.desiredDeadline}`,
    ]),
    '</div>',
    priceBox(price.total),
    table([
      tableHead(),
      `<tbody>${detailRowsWithCategories(firstItems)}</tbody>`,
      isLast ? `<tfoot>${summaryRows(estimate, price)}</tfoot>` : '',
    ].join('')),
    !isLast ? '<p style="text-align:right;font-size:11px;color:#999;margin-top:8px">→ 次ページに続く</p>' : '',
  ].join('')));

  currentIndex = ROWS_FIRST_PAGE;

  // 続きページ
  while (currentIndex < items.length) {
    const chunk = items.slice(currentIndex, currentIndex + ROWS_CONTINUATION);
    const isLastChunk = currentIndex + ROWS_CONTINUATION >= items.length;

    pages.push(page([
      `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">`,
      `<h2 style="font-size:16px;color:#085041;margin:0">お見積書（明細続き）</h2>`,
      `<span style="font-size:11px;color:#999">${estimate.clientName || ''}</span></div>`,
      table([
        tableHead(),
        `<tbody>${detailRowsWithCategories(chunk)}</tbody>`,
        isLastChunk ? `<tfoot>${summaryRows(estimate, price)}</tfoot>` : '',
      ].join('')),
      !isLastChunk ? '<p style="text-align:right;font-size:11px;color:#999;margin-top:8px">→ 次ページに続く</p>' : '',
    ].join('')));

    currentIndex += ROWS_CONTINUATION;
  }

  return pages;
}

// サイト仕様ページ
function buildPageSpec(estimate) {
  const topCount = estimate.topPage ? 1 : 0;
  const totalPages = topCount + estimate.subPageCount + estimate.lpPageCount;

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
    ['SNS連携', estimate.funcSns],
    ['Googleマップ', estimate.funcMap],
  ];
  const active = features.filter(([, v]) => v).map(([n]) => n);
  if (estimate.animLevel !== 'none') active.push(`アニメーション（${estimate.animLevel === 'simple' ? 'シンプル' : 'リッチ'}）`);

  return page([
    heading2('サイト仕様'),
    heading3('基本情報'),
    infoTable([
      infoRow('サイト種別', SITE_TYPE_LABELS[estimate.siteType]),
      infoRow('制作方式', BUILD_METHOD_LABELS[estimate.buildMethod]),
      infoRow('ページ数', `トップ${topCount}P + 下層${estimate.subPageCount}P + LP${estimate.lpPageCount}P（計${totalPages}P）`),
      infoRow('レスポンシブ', estimate.responsive ? '対応する' : 'しない'),
    ].join('')),
    heading3('デザイン設定'),
    infoTable([
      colorRow('メインカラー', estimate.colorMain),
      colorRow('サブカラー', estimate.colorSub),
      colorRow('アクセント', estimate.colorAccent),
      infoRow('フォント', FONT_LABELS[estimate.fontStyle]),
      infoRow('レイアウト', LAYOUT_LABELS[estimate.layoutPattern]),
    ].join('')),
    heading3('選択機能'),
    `<p style="font-size:12px;margin-bottom:20px">${active.length > 0 ? active.join(' / ') : 'なし'}</p>`,
    estimate.referenceUrl1 ? [
      heading3('参考サイト'),
      `<p style="font-size:12px">${estimate.referenceUrl1}${estimate.referenceUrl2 ? '<br>' + estimate.referenceUrl2 : ''}</p>`,
    ].join('') : '',
  ].join(''));
}

// 備考ページ
function buildPageNotes(estimate) {
  return page([
    heading2('備考・補足事項'),
    infoTable([
      infoRow('デザイン修正の無料回数', estimate.freeRevisions || '未設定'),
      infoRow('追加費用について', '仕様変更・ページ追加が発生した場合は別途お見積り'),
      infoRow('素材について', '写真・テキスト等の素材はお客様にご用意いただきます'),
      infoRow('著作権', '制作物の著作権は納品・全額入金後にお客様へ譲渡'),
      infoRow('保守プラン', SUPPORT_LABELS_WITH_PRICE[estimate.supportPlan]),
      infoRow('支払いタイミング', estimate.paymentTiming || '未設定'),
      infoRow('支払い方法', estimate.paymentMethod || '未設定'),
    ].join('')),
    estimate.otherNote ? [heading3('その他備考'), `<p style="font-size:12px;white-space:pre-wrap">${estimate.otherNote}</p>`].join('') : '',
  ].join(''));
}

// HTMLをキャプチャしてPDFページに追加
async function renderPage(html, pdf, isFirstPage) {
  const container = document.createElement('div');
  container.innerHTML = html;
  container.style.cssText = 'position:absolute;left:-9999px;top:0';
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container.firstElementChild, { scale: 2, useCORS: true, logging: false });
    if (!isFirstPage) pdf.addPage();

    const margin = 10;
    const imgWidth = pdf.internal.pageSize.getWidth() - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, margin, imgWidth, imgHeight);
  } finally {
    document.body.removeChild(container);
  }
}

// PDF出力実行
export async function exportPdf(estimate, price) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const estNum = getNextEstimateNumber();
  const validityDays = estimate.validityDays || 30;

  const detailPages = buildDetailPages(estimate, price, estNum, validityDays);
  for (let i = 0; i < detailPages.length; i++) {
    await renderPage(detailPages[i], pdf, i === 0);
  }
  await renderPage(buildPageSpec(estimate), pdf, false);
  await renderPage(buildPageNotes(estimate), pdf, false);

  pdf.save(`MitsuMO_見積書_${estimate.clientName || '未設定'}_${fmtDateShort(new Date())}.pdf`);
}
