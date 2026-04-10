// トースト通知コンポーネント
import { useState, useEffect, useCallback } from 'react';
import styles from './Toast.module.css';

let showToastGlobal = null;

// 外部から呼べるトースト表示関数
export function toast(message) {
  if (showToastGlobal) showToastGlobal(message);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  showToastGlobal = useCallback((message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map((t) => (
        <div key={t.id} className={styles.toast}>
          <span className={styles.icon}>✓</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}
