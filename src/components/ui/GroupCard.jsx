// グループラベル＋ボックス（オプションで選択数カウント表示）
import styles from './GroupCard.module.css';

export default function GroupCard({ label, children, count, total }) {
  return (
    <div>
      <div className={styles.groupLabel}>
        <span>{label}</span>
        {total != null && (
          <span className={styles.countBadge}>{count}/{total}</span>
        )}
      </div>
      <div className={styles.groupBox}>{children}</div>
    </div>
  );
}
