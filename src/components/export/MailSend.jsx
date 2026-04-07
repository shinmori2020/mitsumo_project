// メール送信（mailto:リンク）
import { formatCurrency } from '../../utils/formatCurrency';
import { buildBreakdown } from '../../utils/buildBreakdown';

function buildMailBody(estimate, price) {
  const items = buildBreakdown(estimate);
  const today = new Date();
  const formatDate = (d) => `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;

  let body = '';
  body += 'MitsuMO お見積書\n\n';

  if (estimate.clientName) body += `${estimate.clientName} 様\n`;
  body += `見積日：${formatDate(today)}\n\n`;

  body += `【合計金額（税込）】¥${formatCurrency(price.total)}\n\n`;

  body += '── 明細 ──\n';
  items.forEach((item, i) => {
    const subtotal = item.unit * item.qty;
    const qtyStr = item.qty > 1 ? ` x${item.qty}` : '';
    body += `${i + 1}. ${item.label}${qtyStr} ¥${formatCurrency(subtotal)}\n`;
  });

  body += '\n── 集計 ──\n';
  body += `小計（税抜） ¥${formatCurrency(price.subtotal)}\n`;
  if (price.deadlineAdjustment > 0) {
    body += `納期調整 +¥${formatCurrency(price.deadlineAdjustment)}\n`;
  }
  if (price.discount > 0) {
    body += `割引 -¥${formatCurrency(price.discount)}\n`;
  }
  body += `消費税（10%） ¥${formatCurrency(price.tax)}\n`;
  body += `合計（税込） ¥${formatCurrency(price.total)}\n`;

  return body;
}

// メール送信実行
export function sendMail(estimate, price) {
  const subject = encodeURIComponent(`【MitsuMO】お見積書${estimate.clientName ? ` - ${estimate.clientName} 様` : ''}`);
  const body = encodeURIComponent(buildMailBody(estimate, price));
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}
