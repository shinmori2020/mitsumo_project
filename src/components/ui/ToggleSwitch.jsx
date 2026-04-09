// トグルスイッチ（項目名＋補足テキスト＋金額＋トグル）
import { formatCurrency } from '../../utils/formatCurrency';
import styles from './ToggleSwitch.module.css';

export default function ToggleSwitch({ label, description, checked, onChange, price }) {
  return (
    <div className={styles.row}>
      <div className={styles.labelWrap}>
        <span className={styles.label}>{label}</span>
        {description && <span className={styles.description}>{description}</span>}
      </div>
      <div className={styles.rightSide}>
        {price != null && checked && (
          <span className={styles.inlinePrice}>+¥{formatCurrency(price)}</span>
        )}
        <button
          type="button"
          className={`${styles.track} ${checked ? styles.trackOn : styles.trackOff}`}
          onClick={() => onChange(!checked)}
          role="switch"
          aria-checked={checked}
          aria-label={label}
        >
          <span className={`${styles.knob} ${checked ? styles.knobOn : styles.knobOff}`} />
        </button>
      </div>
    </div>
  );
}
