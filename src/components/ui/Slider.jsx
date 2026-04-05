// スライダー＋数値バッジ
import styles from './Slider.module.css';

export default function Slider({ label, min, max, value, unit, onChange }) {
  return (
    <div className={styles.row}>
      <div className={styles.labelWrap}>
        <span className={styles.label}>{label}</span>
      </div>
      <input
        type="range"
        className={styles.slider}
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
      <div className={styles.badge}>
        <span className={styles.badgeNumber}>{value}</span>
        <span className={styles.badgeUnit}>{unit}</span>
      </div>
    </div>
  );
}
