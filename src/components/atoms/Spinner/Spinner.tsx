import styles from './Spinner.module.css';

export function Spinner({ label = 'Cargando…' }: { label?: string }) {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
