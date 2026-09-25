import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  tone?: 'accent' | 'success' | 'warning' | 'danger';
}

export function ProgressBar({ value, max, label, tone = 'accent' }: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className={styles.wrapper}>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? `${percent}% completado`}
      >
        <div className={`${styles.fill} ${styles[tone]}`} style={{ width: `${percent}%` }} />
      </div>
      <span className={styles.percentLabel}>{percent}%</span>
    </div>
  );
}
