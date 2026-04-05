// トグルスイッチ（項目名＋補足テキスト＋トグル）
import styles from './ToggleSwitch.module.css';

export default function ToggleSwitch({ label, description, checked, onChange }) {
  return (
    <div className={styles.row}>
      <div className={styles.labelWrap}>
        <span className={styles.label}>{label}</span>
        {description && <span className={styles.description}>{description}</span>}
      </div>
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
  );
}
