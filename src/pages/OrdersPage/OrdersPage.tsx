import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Truck } from 'lucide-react';
import { useBranch } from '../../context/BranchContext';
import { barrelRepository, orderRepository, supplierRepository } from '../../data/repository';
import type { OrderStatus, SupplierOrder } from '../../data/types';
import { generateId } from '../../lib/id';
import { daysUntil } from '../../lib/format';
import { PageHeader } from '../../components/molecules/PageHeader/PageHeader';
import { EmptyState } from '../../components/molecules/StateView/StateView';
import { Modal } from '../../components/molecules/Modal/Modal';
import { Button } from '../../components/atoms/Button/Button';
import { OrderCard } from '../../components/organisms/OrderCard/OrderCard';
import inputStyles from '../../components/atoms/inputs.module.css';
import { ORDER_STATUS_LABEL } from './orderLabels';
import styles from './OrdersPage.module.css';

type StatusFilter = OrderStatus | 'todos';

export function OrdersPage() {
  const { activeBranch } = useBranch();
  const [version, setVersion] = useState(0);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');
  const [confirmingOrder, setConfirmingOrder] = useState<SupplierOrder | null>(null);

  const suppliers = useMemo(() => supplierRepository.list(), []);
  const supplierById = useMemo(() => new Map(suppliers.map((s) => [s.id, s])), [suppliers]);

  const orders = useMemo(() => {
    if (!activeBranch) return [];
    void version;
    return orderRepository.list((order) => order.branchId === activeBranch.id);
  }, [activeBranch, version]);

  const inTransit = useMemo(
    () =>
      orders
        .filter((order) => order.status === 'en_transito')
        .sort((a, b) => daysUntil(a.etaDate) - daysUntil(b.etaDate)),
    [orders],
  );

  const filtered = useMemo(
    () => orders.filter((order) => statusFilter === 'todos' || order.status === statusFilter),
    [orders, statusFilter],
  );

  function handleMarkReceived(order: SupplierOrder) {
    orderRepository.update(order.id, {
      status: 'recibida',
      receivedDate: new Date().toISOString().slice(0, 10),
    });

    const supplier = supplierById.get(order.supplierId);
    if (supplier?.category === 'barricas') {
      const oakType = order.items.some((item) => /franc/i.test(item.description)) ? 'frances' : 'americano';
      order.items.forEach((item) => {
        for (let i = 0; i < item.quantity; i += 1) {
          barrelRepository.create({
            id: generateId('barrel'),
            branchId: order.branchId,
            code: `BR-${generateId('n').slice(-4).toUpperCase()}`,
            wineType: 'tinto',
            varietal: 'Sin asignar',
            oakType,
            capacityLiters: 225,
            currentLiters: 0,
            fillDate: new Date().toISOString().slice(0, 10),
            status: 'vacío',
            notes: `Ingresado por orden recibida (${supplier.name})`,
          });
        }
      });
    }

    setVersion((v) => v + 1);
  }

  function handleConfirmReceived() {
    if (!confirmingOrder) return;
    handleMarkReceived(confirmingOrder);
    setConfirmingOrder(null);
  }

  const confirmingSupplier = confirmingOrder ? supplierById.get(confirmingOrder.supplierId) : undefined;

  return (
    <div>
      <PageHeader
        title="Órdenes a proveedor"
        subtitle={activeBranch ? `${orders.length} órdenes en ${activeBranch.name}` : undefined}
      />

      {inTransit.length > 0 ? (
        <section className={styles.transitSection}>
          <h2 className={styles.transitTitle}>
            <Truck size={16} aria-hidden="true" />
            En tránsito
          </h2>
          <div className={styles.grid}>
            {inTransit.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                supplier={supplierById.get(order.supplierId)}
                onMarkReceived={() => setConfirmingOrder(order)}
              />
            ))}
          </div>
        </section>
      ) : null}

      <div className={styles.filters}>
        <select
          className={inputStyles.select}
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          aria-label="Filtrar por estado de orden"
        >
          <option value="todos">Todas las órdenes</option>
          {(Object.keys(ORDER_STATUS_LABEL) as OrderStatus[]).map((status) => (
            <option key={status} value={status}>
              {ORDER_STATUS_LABEL[status]}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Sin órdenes" description="No hay órdenes que coincidan con este filtro." />
      ) : (
        <div className={styles.grid}>
          {filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              supplier={supplierById.get(order.supplierId)}
              onMarkReceived={() => setConfirmingOrder(order)}
            />
          ))}
        </div>
      )}

      {confirmingOrder ? (
        <Modal title="Confirmar recepción" onClose={() => setConfirmingOrder(null)}>
          <p className={styles.confirmText}>
            <AlertTriangle size={16} aria-hidden="true" />
            Vas a marcar la orden de {confirmingSupplier?.name ?? 'este proveedor'} como recibida. Esto actualiza el
            stock
            {confirmingSupplier?.category === 'barricas' ? ' y crea los barriles nuevos correspondientes' : ''} y no
            se puede deshacer desde acá.
          </p>
          <div className={styles.confirmActions}>
            <Button variant="ghost" onClick={() => setConfirmingOrder(null)}>
              Cancelar
            </Button>
            <Button variant="primary" icon={<CheckCircle2 size={14} />} onClick={handleConfirmReceived}>
              Sí, marcar como recibida
            </Button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
