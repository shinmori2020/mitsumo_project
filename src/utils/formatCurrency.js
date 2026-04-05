// 金額を3桁カンマ区切りでフォーマット
export function formatCurrency(amount) {
  return Math.round(amount).toLocaleString();
}
