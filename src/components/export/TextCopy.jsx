// テキストコピー（クリップボードAPI）
import { formatCurrency } from '../../utils/formatCurrency';
import { buildBreakdown } from '../../utils/buildBreakdown';

const DEADLINE_LABELS = { 1.0: '通常', 1.3: '急ぎ（×1.3）', 1.5: '特急（×1.5）' };

function buildText(estimate, price) {
  const items = buildBreakdown(estimate);
  const today = new Date();
  const formatDate = (d) => `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;

  let text = '';
  text += '━━━━━━━━━━━━━━━━━━━━\n';
  text += '  MitsuMO お見積書\n';
  text += '━━━━━━━━━━━━━━━━━━━━\n\n';

  if (estimate.clientName) text += `${estimate.clientName} 様\n`;
  text += `見積日：${formatDate(today)}\n\n`;

  text += `【合計金額（税込）】¥${formatCurrency(price.total)}\n\n`;

  text += '── 明細 ──────────────\n';
  items.forEach((item, i) => {
    const subtotal = item.unit * item.qty;
    const qtyStr = item.qty > 1 ? ` ×${item.qty}` : '';
    text += `${String(i + 1).padStart(2)}. ${item.label}${qtyStr}　¥${formatCurrency(subtotal)}\n`;
  });

  text += '\n── 集計 ──────────────\n';
  text += `小計（税抜）　¥${formatCurrency(price.subtotal)}\n`;
  if (price.deadlineAdjustment > 0) {
    text += `納期調整（${DEADLINE_LABELS[estimate.deadlineRate]}）　+¥${formatCurrency(price.deadlineAdjustment)}\n`;
  }
  if (price.discount > 0) {
    const dLabel = estimate.discountType === 'amount' ? '値引き' : `${estimate.discountValue}%割引`;
    text += `${dLabel}　-¥${formatCurrency(price.discount)}\n`;
  }
  text += `消費税（10%）　¥${formatCurrency(price.tax)}\n`;
  text += `合計（税込）　¥${formatCurrency(price.total)}\n`;
  text += '━━━━━━━━━━━━━━━━━━━━\n';

  return text;
}

// テキストコピー実行
export async function copyText(estimate, price) {
  const text = buildText(estimate, price);
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // フォールバック
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  }
}
