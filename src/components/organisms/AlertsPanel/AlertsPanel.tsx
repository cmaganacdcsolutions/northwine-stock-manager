import { AlertTriangle, Truck } from 'lucide-react';
import type { ArrivalAlert, LowStockAlert } from '../../../pages/DashboardPage/useDashboardData';
import { EmptyState } from '../../molecules/StateView/StateView';
import styles from './AlertsPanel.module.css';

const LABEL_TEXT: Record<string, string> = {
  reserva_joven: 'Reserva joven',
  '10': '10 años',
  '20': '20 años',
  '25': '25 años',
};

interface AlertsPanelProps {
  lowStock: LowStockAlert[];
  arrivals: ArrivalAlert[];
}

export function AlertsPanel({ lowStock, arrivals }: AlertsPanelProps) {
  return (
    <div className={styles.grid}>
      <section className={styles.panel}>
        <h2 className={styles.title}>
          <AlertTriangle size={16} className={styles.iconWarning} aria-hidden="true" />
          Stock bajo
        </h2>
        {lowStock.length === 0 ? (
          <EmptyState title="Todo en orden" description="Ningún añejado por debajo del umbral mínimo." />
        ) : (
          <ul className={styles.list}>
            {lowStock.map((alert) => (
              <li key={alert.vintageId} className={styles.item}>
                <span>
                  {alert.wineName} · {LABEL_TEXT[alert.label] ?? alert.label}
                </span>
                <span className={styles.badgeDanger}>
                  {alert.stockBottles} / {alert.lowStockThreshold} u.
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.panel}>
        <h2 className={styles.title}>
          <Truck size={16} className={styles.iconInfo} aria-hidden="true" />
          Llegadas próximas
        </h2>
        {arrivals.length === 0 ? (
          <EmptyState title="Sin llegadas próximas" description="No hay órdenes por llegar en los próximos 14 días." />
        ) : (
          <ul className={styles.list}>
            {arrivals.map((arrival) => (
              <li key={arrival.orderId} className={styles.item}>
                <span>{arrival.supplierName}</span>
                <span className={styles.badgeInfo}>
                  {arrival.daysUntilArrival <= 0
                    ? 'Llega hoy'
                    : `${arrival.daysUntilArrival} ${arrival.daysUntilArrival === 1 ? 'día' : 'días'}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
