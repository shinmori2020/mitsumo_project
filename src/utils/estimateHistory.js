// 見積もり履歴管理（LocalStorage）
const HISTORY_KEY = 'mitsumo_history';
const MAX_HISTORY = 20;

function formatDate(d) {
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// 履歴一覧を取得
export function getHistory() {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// 見積もりを履歴に保存
export function saveToHistory(estimate, price) {
  const history = getHistory();
  const entry = {
    id: Date.now(),
    date: formatDate(new Date()),
    clientName: estimate.clientName || '名称未設定',
    total: price.total,
    estimate: { ...estimate },
  };

  // 先頭に追加、上限を超えたら古いものを削除
  history.unshift(entry);
  if (history.length > MAX_HISTORY) history.pop();

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {}

  return entry;
}

// 履歴から削除
export function deleteFromHistory(id) {
  const history = getHistory().filter(h => h.id !== id);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {}
  return history;
}

// 履歴全削除
export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {}
}
