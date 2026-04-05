// グループラベル＋ボックス
import styles from './GroupCard.module.css';

export default function GroupCard({ label, children }) {
  return (
    <div>
      <div className={styles.groupLabel}>{label}</div>
      <div className={styles.groupBox}>{children}</div>
    </div>
  );
}
