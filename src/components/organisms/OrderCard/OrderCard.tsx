import { CheckCircle2, Clock, ClockAlert } from 'lucide-react';
import type { Supplier, SupplierOrder } from '../../../data/types';
import { Badge } from '../../atoms/Badge/Badge';
import { Button } from '../../atoms/Button/Button';
import { formatCurrency, formatDate, daysUntil } from '../../../lib/format';
import { ORDER_STATUS_LABEL, ORDER_STATUS_TONE, SUPPLIER_CATEGORY_LABEL } from '../../../pages/OrdersPage/orderLabels';
import styles from './OrderCard.module.css';

interface OrderCardProps {
  order: SupplierOrder;
  supplier: Supplier | undefined;
  onMarkReceived: () => void;
}

export function OrderCard({ order, supplier, onMarkReceived }: OrderCardProps) {
  const total = order.items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
  const days = daysUntil(order.etaDate);
  const canReceive = order.status === 'enviada' || order.status === 'en_transito';
  const isDelayed = canReceive && days < 0;

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div>
          <p className={styles.supplier}>{supplier?.name ?? 'Proveedor'}</p>
          <p className={styles.category}>{supplier ? SUPPLIER_CATEGORY_LABEL[supplier.category] : ''}</p>
        </div>
        {isDelayed ? (
          <Badge tone="danger">
            <ClockAlert size={12} aria-hidden="true" />
            Retrasada
          </Badge>
        ) : (
          <Badge tone={ORDER_STATUS_TONE[order.status]}>{ORDER_STATUS_LABEL[order.status]}</Badge>
        )}
      </header>

      <ul className={styles.items}>
        {order.items.map((item) => (
          <li key={item.id} className={styles.item}>
            <span>
              {item.description} · {item.quantity} {item.unit}
            </span>
          </li>
        ))}
      </ul>

      <div className={styles.footer}>
        <div className={styles.meta}>
          <span className={`${styles.metaLine} ${isDelayed ? styles.metaLineDanger : ''}`}>
            <Clock size={14} aria-hidden="true" />
            {order.status === 'recibida' && order.receivedDate
              ? `Recibida el ${formatDate(order.receivedDate)}`
              : isDelayed
                ? `Vencida hace ${Math.abs(days)} ${Math.abs(days) === 1 ? 'día' : 'días'} · ETA ${formatDate(order.etaDate)}`
                : order.status === 'en_transito' || order.status === 'enviada'
                  ? days === 0
                    ? 'Llega hoy'
                    : `Llega en ${days} ${days === 1 ? 'día' : 'días'} · ${formatDate(order.etaDate)}`
                  : `ETA ${formatDate(order.etaDate)}`}
          </span>
          <span className={styles.total}>{formatCurrency(total)}</span>
        </div>
        {canReceive ? (
          <Button size="sm" variant="secondary" icon={<CheckCircle2 size={14} />} onClick={onMarkReceived}>
            Marcar como recibida
          </Button>
        ) : null}
      </div>
    </article>
  );
}
