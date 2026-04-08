// PDF出力（html2canvas + jsPDF、ページ別キャプチャ・明細自動分割）
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { formatCurrency } from '../../utils/formatCurrency';
import { buildBreakdown } from '../../utils/buildBreakdown';

const SITE_TYPE_LABELS = { corporate: 'コーポレート', lp: 'LP', ec: 'EC', blog: 'ブログ' };
const BUILD_METHOD_LABELS = { wordpress: 'WordPress', html: 'HTML/CSS' };
const FONT_LABELS = { soft: 'やわらかい', sharp: 'シャープ', formal: 'フォーマル', casual: 'カジュアル' };
const LAYOUT_LABELS = { A: 'パターンA', B: 'パターンB', C: 'パターンC', D: 'パターンD' };
const SUPPORT_LABELS = { none: 'なし', light: 'ライト（5,000円/月）', standard: 'スタンダード（15,000円/月）' };
const DEADLINE_LABELS = { 1.0: '通常', 1.3: '急ぎ（×1.3）', 1.5: '特急（×1.5）' };

function fmtDate(d) {
  return `${d.getFullYear()}年${String(d.getMonth() + 1).padStart(2, '0')}月${String(d.getDate()).padStart(2, '0')}日`;
}
function fmtDateShort(d) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

const pageStyle = `width:780px;font-family:'Noto Sans JP',sans-serif;color:#333;padding:40px;background:#fff;`;

// 1ページに収まる明細行数（ヘッダー情報+合計金額がある1ページ目は少なめ）
const ROWS_FIRST_PAGE = 18;
const ROWS_CONTINUATION = 28;

// テーブルヘッダーHTML
const tableHead = `
  <thead>
    <tr style="background:#1D9E75;color:#fff">
      <th style="padding:8px;border:1px solid #1D9E75;width:40px">No.</th>
      <th style="padding:8px;border:1px solid #1D9E75;text-align:left">項目</th>
      <th style="padding:8px;border:1px solid #1D9E75;text-align:right;width:100px">単価</th>
      <th style="padding:8px;border:1px solid #1D9E75;width:50px">数量</th>
      <th style="padding:8px;border:1px solid #1D9E75;text-align:right;width:110px">小計</th>
    </tr>
  </thead>`;

function buildDetailRow(item, i) {
  return `<tr style="background:${i % 2 === 1 ? '#f0f8f4' : '#fff'}">
    <td style="padding:6px 8px;border:1px solid #ddd;text-align:center">${i + 1}</td>
    <td style="padding:6px 8px;border:1px solid #ddd">${item.label}</td>
    <td style="padding:6px 8px;border:1px solid #ddd;text-align:right">¥${formatCurrency(item.unit)}</td>
    <td style="padding:6px 8px;border:1px solid #ddd;text-align:center">${item.qty}</td>
    <td style="padding:6px 8px;border:1px solid #ddd;text-align:right">¥${formatCurrency(item.unit * item.qty)}</td>
  </tr>`;
}

function buildSummaryRows(estimate, price) {
  let rows = `
    <tr><td colspan="4" style="padding:6px 8px;border:1px solid #ddd;text-align:right;font-weight:bold">小計（税抜）</td>
    <td style="padding:6px 8px;border:1px solid #ddd;text-align:right">¥${formatCurrency(price.subtotal)}</td></tr>
  `;
  if (price.deadlineAdjustment > 0) {
    rows += `<tr><td colspan="4" style="padding:6px 8px;border:1px solid #ddd;text-align:right">納期調整（${DEADLINE_LABELS[estimate.deadlineRate]}）</td>
    <td style="padding:6px 8px;border:1px solid #ddd;text-align:right">+¥${formatCurrency(price.deadlineAdjustment)}</td></tr>`;
  }
  if (price.discount > 0) {
    const dLabel = estimate.discountType === 'amount' ? '値引き' : `${estimate.discountValue}%割引`;
    rows += `<tr><td colspan="4" style="padding:6px 8px;border:1px solid #ddd;text-align:right">${dLabel}</td>
    <td style="padding:6px 8px;border:1px solid #ddd;text-align:right">-¥${formatCurrency(price.discount)}</td></tr>`;
  }
  rows += `
    <tr><td colspan="4" style="padding:6px 8px;border:1px solid #ddd;text-align:right">消費税（10%）</td>
    <td style="padding:6px 8px;border:1px solid #ddd;text-align:right">¥${formatCurrency(price.tax)}</td></tr>
    <tr style="background:#085041;color:#fff"><td colspan="4" style="padding:8px;border:1px solid #085041;text-align:right;font-weight:bold;font-size:14px">合計（税込）</td>
    <td style="padding:8px;border:1px solid #085041;text-align:right;font-weight:bold;font-size:14px">¥${formatCurrency(price.total)}</td></tr>
  `;
  return rows;
}

// 明細ページ群を生成（1ページ目はヘッダー付き、2ページ目以降は明細の続き）
function buildDetailPages(estimate, price) {
  const items = buildBreakdown(estimate);
  const today = new Date();
  const expiry = new Date(today);
  expiry.setDate(expiry.getDate() + 30);
  const estNum = `EST-${today.getFullYear()}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`;

  const pages = [];
  let currentIndex = 0;

  // 1ページ目: ヘッダー + 合計金額 + 明細（先頭部分）
  const firstPageRows = items.slice(0, ROWS_FIRST_PAGE);
  const isLastPage = items.length <= ROWS_FIRST_PAGE;

  let firstPageHtml = `<div style="${pageStyle}">
    <h1 style="text-align:center;font-size:24px;color:#085041;letter-spacing:8px;margin-bottom:24px">お 見 積 書</h1>
    <div style="display:flex;justify-content:space-between;margin-bottom:20px">
      <div><span style="font-size:16px;font-weight:bold;color:#085041">${estimate.clientName || '（お客様名未入力）'} 御中</span></div>
      <div style="text-align:right;font-size:12px;color:#555">
        <div>見積日：${fmtDate(today)}</div>
        <div>有効期限：${fmtDate(expiry)}</div>
        <div>見積番号：${estNum}</div>
        ${estimate.desiredDeadline ? `<div>納期：${estimate.desiredDeadline}</div>` : ''}
      </div>
    </div>
    <div style="background:#085041;color:#fff;padding:16px;border-radius:8px;text-align:center;margin-bottom:24px">
      <div style="font-size:12px;color:#9FE1CB">お見積り合計金額（税込）</div>
      <div style="font-size:32px;font-weight:bold">¥${formatCurrency(price.total)}</div>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:12px">
      ${tableHead}
      <tbody>${firstPageRows.map((item, i) => buildDetailRow(item, i)).join('')}</tbody>
      ${isLastPage ? `<tfoot>${buildSummaryRows(estimate, price)}</tfoot>` : ''}
    </table>
    ${!isLastPage ? '<p style="text-align:right;font-size:11px;color:#999;margin-top:8px">→ 次ページに続く</p>' : ''}
  </div>`;

  pages.push(firstPageHtml);
  currentIndex = ROWS_FIRST_PAGE;

  // 続きのページ
  while (currentIndex < items.length) {
    const remainingItems = items.slice(currentIndex, currentIndex + ROWS_CONTINUATION);
    const isLast = currentIndex + ROWS_CONTINUATION >= items.length;

    let pageHtml = `<div style="${pageStyle}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h2 style="font-size:16px;color:#085041;margin:0">お見積書（明細続き）</h2>
        <span style="font-size:11px;color:#999">${estimate.clientName || ''}</span>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        ${tableHead}
        <tbody>${remainingItems.map((item, i) => buildDetailRow(item, currentIndex + i)).join('')}</tbody>
        ${isLast ? `<tfoot>${buildSummaryRows(estimate, price)}</tfoot>` : ''}
      </table>
      ${!isLast ? '<p style="text-align:right;font-size:11px;color:#999;margin-top:8px">→ 次ページに続く</p>' : ''}
    </div>`;

    pages.push(pageHtml);
    currentIndex += ROWS_CONTINUATION;
  }

  return pages;
}

// ページ: サイト仕様
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
  const activeFeatures = features.filter(([, v]) => v).map(([n]) => n);
  if (estimate.animLevel !== 'none') activeFeatures.push(`アニメーション（${estimate.animLevel === 'simple' ? 'シンプル' : 'リッチ'}）`);

  return `<div style="${pageStyle}">
    <h2 style="font-size:18px;color:#085041;border-bottom:2px solid #1D9E75;padding-bottom:8px;margin-bottom:20px">サイト仕様</h2>

    <h3 style="font-size:14px;color:#1D9E75;margin:16px 0 8px">基本情報</h3>
    <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:20px">
      <tr><td style="padding:8px 10px;border:1px solid #ddd;background:#f0f8f4;width:160px;font-weight:bold">サイト種別</td><td style="padding:8px 10px;border:1px solid #ddd">${SITE_TYPE_LABELS[estimate.siteType]}</td></tr>
      <tr><td style="padding:8px 10px;border:1px solid #ddd;background:#f0f8f4;font-weight:bold">制作方式</td><td style="padding:8px 10px;border:1px solid #ddd">${BUILD_METHOD_LABELS[estimate.buildMethod]}</td></tr>
      <tr><td style="padding:8px 10px;border:1px solid #ddd;background:#f0f8f4;font-weight:bold">ページ数</td><td style="padding:8px 10px;border:1px solid #ddd">トップ${topCount}P + 下層${estimate.subPageCount}P + LP${estimate.lpPageCount}P（計${totalPages}P）</td></tr>
      <tr><td style="padding:8px 10px;border:1px solid #ddd;background:#f0f8f4;font-weight:bold">レスポンシブ</td><td style="padding:8px 10px;border:1px solid #ddd">${estimate.responsive ? '対応する' : 'しない'}</td></tr>
    </table>

    <h3 style="font-size:14px;color:#1D9E75;margin:16px 0 8px">デザイン設定</h3>
    <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:20px">
      <tr><td style="padding:8px 10px;border:1px solid #ddd;background:#f0f8f4;width:160px;font-weight:bold">メインカラー</td><td style="padding:8px 10px;border:1px solid #ddd"><span style="display:inline-block;width:14px;height:14px;background:${estimate.colorMain};border-radius:3px;vertical-align:middle;margin-right:6px"></span>${estimate.colorMain}</td></tr>
      <tr><td style="padding:8px 10px;border:1px solid #ddd;background:#f0f8f4;font-weight:bold">サブカラー</td><td style="padding:8px 10px;border:1px solid #ddd"><span style="display:inline-block;width:14px;height:14px;background:${estimate.colorSub};border-radius:3px;vertical-align:middle;margin-right:6px"></span>${estimate.colorSub}</td></tr>
      <tr><td style="padding:8px 10px;border:1px solid #ddd;background:#f0f8f4;font-weight:bold">アクセント</td><td style="padding:8px 10px;border:1px solid #ddd"><span style="display:inline-block;width:14px;height:14px;background:${estimate.colorAccent};border-radius:3px;vertical-align:middle;margin-right:6px"></span>${estimate.colorAccent}</td></tr>
      <tr><td style="padding:8px 10px;border:1px solid #ddd;background:#f0f8f4;font-weight:bold">フォント</td><td style="padding:8px 10px;border:1px solid #ddd">${FONT_LABELS[estimate.fontStyle]}</td></tr>
      <tr><td style="padding:8px 10px;border:1px solid #ddd;background:#f0f8f4;font-weight:bold">レイアウト</td><td style="padding:8px 10px;border:1px solid #ddd">${LAYOUT_LABELS[estimate.layoutPattern]}</td></tr>
    </table>

    <h3 style="font-size:14px;color:#1D9E75;margin:16px 0 8px">選択機能</h3>
    <p style="font-size:12px;margin-bottom:20px">${activeFeatures.length > 0 ? activeFeatures.join(' / ') : 'なし'}</p>

    ${estimate.referenceUrl1 ? `<h3 style="font-size:14px;color:#1D9E75;margin:16px 0 8px">参考サイト</h3><p style="font-size:12px">${estimate.referenceUrl1}${estimate.referenceUrl2 ? '<br>' + estimate.referenceUrl2 : ''}</p>` : ''}
  </div>`;
}

// ページ: 備考・補足事項
function buildPageNotes(estimate) {
  return `<div style="${pageStyle}">
    <h2 style="font-size:18px;color:#085041;border-bottom:2px solid #1D9E75;padding-bottom:8px;margin-bottom:20px">備考・補足事項</h2>

    <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:20px">
      <tr><td style="padding:8px 10px;border:1px solid #ddd;background:#f0f8f4;width:180px;font-weight:bold">デザイン修正の無料回数</td><td style="padding:8px 10px;border:1px solid #ddd">${estimate.freeRevisions || '未設定'}</td></tr>
      <tr><td style="padding:8px 10px;border:1px solid #ddd;background:#f0f8f4;font-weight:bold">追加費用について</td><td style="padding:8px 10px;border:1px solid #ddd">仕様変更・ページ追加が発生した場合は別途お見積り</td></tr>
      <tr><td style="padding:8px 10px;border:1px solid #ddd;background:#f0f8f4;font-weight:bold">素材について</td><td style="padding:8px 10px;border:1px solid #ddd">写真・テキスト等の素材はお客様にご用意いただきます</td></tr>
      <tr><td style="padding:8px 10px;border:1px solid #ddd;background:#f0f8f4;font-weight:bold">著作権</td><td style="padding:8px 10px;border:1px solid #ddd">制作物の著作権は納品・全額入金後にお客様へ譲渡</td></tr>
      <tr><td style="padding:8px 10px;border:1px solid #ddd;background:#f0f8f4;font-weight:bold">保守プラン</td><td style="padding:8px 10px;border:1px solid #ddd">${SUPPORT_LABELS[estimate.supportPlan]}</td></tr>
      <tr><td style="padding:8px 10px;border:1px solid #ddd;background:#f0f8f4;font-weight:bold">支払いタイミング</td><td style="padding:8px 10px;border:1px solid #ddd">${estimate.paymentTiming || '未設定'}</td></tr>
      <tr><td style="padding:8px 10px;border:1px solid #ddd;background:#f0f8f4;font-weight:bold">支払い方法</td><td style="padding:8px 10px;border:1px solid #ddd">${estimate.paymentMethod || '未設定'}</td></tr>
    </table>

    ${estimate.otherNote ? `<h3 style="font-size:14px;color:#1D9E75;margin:16px 0 8px">その他備考</h3><p style="font-size:12px;white-space:pre-wrap">${estimate.otherNote}</p>` : ''}
  </div>`;
}

// 1つのHTMLをキャプチャしてPDFページに追加
async function renderPage(html, pdf, isFirstPage) {
  const container = document.createElement('div');
  container.innerHTML = html;
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container.firstElementChild, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    if (!isFirstPage) pdf.addPage();

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const margin = 10;
    const imgWidth = pdfWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, margin, imgWidth, imgHeight);
  } finally {
    document.body.removeChild(container);
  }
}

// PDF出力実行
export async function exportPdf(estimate, price) {
  const pdf = new jsPDF('p', 'mm', 'a4');

  // 明細ページ（自動分割）
  const detailPages = buildDetailPages(estimate, price);
  for (let i = 0; i < detailPages.length; i++) {
    await renderPage(detailPages[i], pdf, i === 0);
  }

  // サイト仕様
  await renderPage(buildPageSpec(estimate), pdf, false);

  // 備考
  await renderPage(buildPageNotes(estimate), pdf, false);

  const clientName = estimate.clientName || '未設定';
  pdf.save(`MitsuMO_見積書_${clientName}_${fmtDateShort(new Date())}.pdf`);
}
