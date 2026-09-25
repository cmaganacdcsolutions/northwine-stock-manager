import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { DashboardData } from '../../../pages/DashboardPage/useDashboardData';
import { EmptyState } from '../../molecules/StateView/StateView';
import styles from './StockByTypeChart.module.css';

interface StockByTypeChartProps {
  data: DashboardData['stockByType'];
}

const TYPE_COLOR_VAR: Record<string, string> = {
  Tinto: '--nw-wine',
  Blanco: '--nw-warning',
  Rosado: '--nw-accent',
};

export function StockByTypeChart({ data }: StockByTypeChartProps) {
  const total = data.reduce((sum, item) => sum + item.bottles, 0);

  if (total === 0) {
    return (
      <div className={styles.panel}>
        <h2 className={styles.title}>Stock por tipo de vino</h2>
        <EmptyState title="Sin stock cargado" description="No hay botellas registradas en esta sucursal." />
      </div>
    );
  }

  const rootStyles = getComputedStyle(document.documentElement);

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Stock por tipo de vino</h2>
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={rootStyles.getPropertyValue('--nw-border')} />
            <XAxis
              dataKey="label"
              tick={{ fill: rootStyles.getPropertyValue('--nw-text-muted'), fontSize: 12 }}
              axisLine={{ stroke: rootStyles.getPropertyValue('--nw-border') }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: rootStyles.getPropertyValue('--nw-text-muted'), fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: rootStyles.getPropertyValue('--nw-surface'),
                border: `1px solid ${rootStyles.getPropertyValue('--nw-border')}`,
                borderRadius: 8,
                color: rootStyles.getPropertyValue('--nw-text'),
              }}
              formatter={(value) => [`${value ?? 0} botellas`, '']}
            />
            <Bar dataKey="bottles" radius={[6, 6, 0, 0]} maxBarSize={64}>
              {data.map((entry) => (
                <Cell key={entry.type} fill={rootStyles.getPropertyValue(TYPE_COLOR_VAR[entry.label] ?? '--nw-accent')} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
