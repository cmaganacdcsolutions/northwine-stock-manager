import { useMemo } from 'react';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { useBranch } from '../../context/BranchContext';
import { movementRepository, vintageRepository, wineRepository } from '../../data/repository';
import { PageHeader } from '../../components/molecules/PageHeader/PageHeader';
import { EmptyState } from '../../components/molecules/StateView/StateView';
import { Badge } from '../../components/atoms/Badge/Badge';
import { formatDate, formatNumber } from '../../lib/format';
import { VINTAGE_LABEL_TEXT } from '../WinesPage/wineLabels';
import styles from './MovementsPage.module.css';

export function MovementsPage() {
  const { activeBranch } = useBranch();

  const rows = useMemo(() => {
    if (!activeBranch) return [];
    const vintages = vintageRepository.list();
    const wines = wineRepository.list();
    const vintageById = new Map(vintages.map((v) => [v.id, v]));
    const wineById = new Map(wines.map((w) => [w.id, w]));

    return movementRepository
      .list((movement) => movement.branchId === activeBranch.id)
      .map((movement) => {
        const vintage = vintageById.get(movement.vintageId);
        const wine = vintage ? wineById.get(vintage.wineId) : undefined;
        return {
          ...movement,
          wineName: wine?.name ?? 'Vino eliminado',
          vintageLabel: vintage ? VINTAGE_LABEL_TEXT[vintage.label] : '—',
        };
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [activeBranch]);

  return (
    <div>
      <PageHeader
        title="Movimientos"
        subtitle={activeBranch ? `Historial de inventario en ${activeBranch.name}` : undefined}
      />

      {rows.length === 0 ? (
        <EmptyState
          title="Sin movimientos"
          description="Los ajustes de stock que hagas desde Vinos y añejados van a aparecer acá."
        />
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className="visually-hidden">Movimientos de inventario</caption>
            <thead>
              <tr>
                <th scope="col">Fecha</th>
                <th scope="col">Tipo</th>
                <th scope="col">Vino</th>
                <th scope="col">Añejado</th>
                <th scope="col">Cantidad</th>
                <th scope="col">Motivo</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{formatDate(row.date)}</td>
                  <td>
                    {row.type === 'entrada' ? (
                      <Badge tone="success">
                        <ArrowDownCircle size={12} /> Entrada
                      </Badge>
                    ) : (
                      <Badge tone="danger">
                        <ArrowUpCircle size={12} /> Salida
                      </Badge>
                    )}
                  </td>
                  <td>{row.wineName}</td>
                  <td>{row.vintageLabel}</td>
                  <td>{formatNumber(row.quantity)}</td>
                  <td className={styles.reason}>{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
