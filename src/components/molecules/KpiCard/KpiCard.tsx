import type { ComponentType } from 'react';
import styles from './KpiCard.module.css';

interface KpiCardProps {
  label: string;
  value: string;
  icon: ComponentType<{ size?: number }>;
  tone?: 'accent' | 'warning' | 'info';
}

export function KpiCard({ label, value, icon: Icon, tone = 'accent' }: KpiCardProps) {
  return (
    <div className={styles.card}>
      <span className={`${styles.iconWrap} ${styles[tone]}`}>
        <Icon size={20} />
      </span>
      <div>
        <p className={styles.value}>{value}</p>
        <p className={styles.label}>{label}</p>
      </div>
    </div>
  );
}
