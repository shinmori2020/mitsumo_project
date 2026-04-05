// ピル型選択ボタン
import styles from './PillButton.module.css';

export default function PillButton({ label, selected, onClick }) {
  return (
    <button
      className={`${styles.pill} ${selected ? styles.active : styles.inactive}`}
      onClick={onClick}
      type="button"
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}
