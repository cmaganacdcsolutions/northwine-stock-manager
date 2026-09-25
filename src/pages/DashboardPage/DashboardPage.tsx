import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, Wine, PackageCheck, Truck, DollarSign, PackagePlus } from 'lucide-react';
import { useBranch } from '../../context/BranchContext';
import { PageHeader } from '../../components/molecules/PageHeader/PageHeader';
import { KpiCard } from '../../components/molecules/KpiCard/KpiCard';
import { AlertsPanel } from '../../components/organisms/AlertsPanel/AlertsPanel';
import { Spinner } from '../../components/atoms/Spinner/Spinner';
import { EmptyState } from '../../components/molecules/StateView/StateView';
import { formatCurrency, formatNumber } from '../../lib/format';
import { useDashboardData } from './useDashboardData';
import styles from './DashboardPage.module.css';

// recharts pulls in a heavy dependency tree; lazy-load it so the initial
// dashboard paint (KPIs, alerts) isn't blocked on it.
const StockByTypeChart = lazy(() =>
  import('../../components/organisms/StockByTypeChart/StockByTypeChart').then((mod) => ({
    default: mod.StockByTypeChart,
  })),
);

export function DashboardPage() {
  const { activeBranch } = useBranch();
  const navigate = useNavigate();
  const data = useDashboardData(activeBranch?.id);

  const isEmptyBranch =
    data.litersInBarrel === 0 &&
    data.bottlesInStock === 0 &&
    data.ordersInTransit === 0 &&
    data.barrelsReadyToBottle === 0;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={activeBranch ? `Resumen operativo de ${activeBranch.name}` : undefined}
      />

      {isEmptyBranch ? (
        <EmptyState
          icon={<PackagePlus size={28} strokeWidth={1.5} />}
          title="Todavía no hay movimientos en esta sucursal"
          description="Registrá el primer barril o la primera orden a proveedor para empezar a ver KPIs aquí."
          action={{ label: 'Registrar primer barril', onClick: () => navigate('/barriles') }}
        />
      ) : (
        <>
      <div className={styles.kpiGrid}>
        <KpiCard label="Litros en barrica" value={`${formatNumber(data.litersInBarrel)} L`} icon={Droplets} />
        <KpiCard label="Botellas en stock" value={formatNumber(data.bottlesInStock)} icon={Wine} />
        <KpiCard
          label="Barriles próximos a embotellar"
          value={formatNumber(data.barrelsReadyToBottle)}
          icon={PackageCheck}
          tone="warning"
        />
        <KpiCard label="Órdenes en tránsito" value={formatNumber(data.ordersInTransit)} icon={Truck} tone="info" />
        <KpiCard label="Valor de inventario" value={formatCurrency(data.inventoryValue)} icon={DollarSign} />
      </div>

      <div className={styles.section}>
        <Suspense fallback={<Spinner label="Cargando gráfico…" />}>
          <StockByTypeChart data={data.stockByType} />
        </Suspense>
      </div>

      <div className={styles.section}>
        <AlertsPanel lowStock={data.lowStockAlerts} arrivals={data.upcomingArrivals} />
      </div>
        </>
      )}
    </div>
  );
}
