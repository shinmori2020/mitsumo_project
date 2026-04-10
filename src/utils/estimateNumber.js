// 見積番号の連番管理（LocalStorage）
const NUM_KEY = 'mitsumo_est_number';

export function getNextEstimateNumber() {
  const year = new Date().getFullYear();
  let seq = 1;

  try {
    const saved = localStorage.getItem(NUM_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      if (data.year === year) {
        seq = data.seq + 1;
      }
    }
  } catch {}

  try {
    localStorage.setItem(NUM_KEY, JSON.stringify({ year, seq }));
  } catch {}

  return `EST-${year}-${String(seq).padStart(4, '0')}`;
}
