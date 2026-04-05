// ステップインジケーター（上部固定）+ サイドバー左右切り替えスイッチ
import styles from './StepIndicator.module.css';

const STEP_LABELS = ['基本情報', '機能選択', 'デザイン', 'オプション', '結果'];

export default function StepIndicator({ currentStep, sidebarPosition, onToggleSidebar }) {
  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div className={styles.title}>MitsuMO</div>
        <div className={styles.sidebarToggle}>
          <span className={styles.toggleLabel}>サイドバー</span>
          <button
            type="button"
            className={styles.toggleButton}
            onClick={onToggleSidebar}
            aria-label="サイドバーの位置を切り替え"
          >
            <span className={`${styles.toggleOption} ${sidebarPosition === 'left' ? styles.toggleActive : ''}`}>左</span>
            <span className={`${styles.toggleOption} ${sidebarPosition === 'right' ? styles.toggleActive : ''}`}>右</span>
          </button>
        </div>
      </div>
      <div className={styles.steps}>
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          return (
            <div key={stepNum} style={{ display: 'flex', alignItems: 'center' }}>
              {i > 0 && (
                <div
                  className={`${styles.line} ${
                    stepNum <= currentStep ? styles.lineCompleted : styles.linePending
                  }`}
                />
              )}
              <div className={styles.stepItem}>
                <div
                  className={`${styles.circle} ${
                    isCurrent
                      ? styles.circleCurrent
                      : isCompleted
                      ? styles.circleCompleted
                      : styles.circlePending
                  }`}
                >
                  {isCompleted ? '✓' : stepNum}
                </div>
                <span
                  className={`${styles.stepLabel} ${
                    isCurrent || isCompleted ? styles.labelActive : styles.labelPending
                  }`}
                >
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </header>
  );
}
