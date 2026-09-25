import { useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useBranch } from '../../context/BranchContext';
import { movementRepository, vintageRepository, wineRepository } from '../../data/repository';
import type { MovementType, VintageLabel, Wine, WineVintage } from '../../data/types';
import { generateId } from '../../lib/id';
import { formatCurrency, formatNumber } from '../../lib/format';
import { PageHeader } from '../../components/molecules/PageHeader/PageHeader';
import { EmptyState } from '../../components/molecules/StateView/StateView';
import { Modal } from '../../components/molecules/Modal/Modal';
import { Badge } from '../../components/atoms/Badge/Badge';
import { SegmentedControl } from '../../components/molecules/SegmentedControl/SegmentedControl';
import { StockAdjustmentForm } from '../../components/organisms/StockAdjustmentForm/StockAdjustmentForm';
import { VINTAGE_LABEL_TEXT, WINE_TYPE_TEXT } from './wineLabels';
import styles from './WinesPage.module.css';

// Fixed display order for the segmented control — extensible to more
// reserve tiers via this array alone, per STOCK_MANAGER_SPEC.md §5 ("no
// hardcodear solo 3 en el modelo de datos").
const SEGMENT_ORDER: VintageLabel[] = ['reserva_joven', '10', '20', '25'];

export function WinesPage() {
  const { activeBranch } = useBranch();
  const [version, setVersion] = useState(0);
  const [adjusting, setAdjusting] = useState<{ vintage: WineVintage; wine: Wine } | null>(null);

  const wines = useMemo(() => wineRepository.list(), []);
  const wineById = useMemo(() => new Map(wines.map((wine) => [wine.id, wine])), [wines]);

  const vintages = useMemo(() => {
    if (!activeBranch) return [];
    void version;
    return vintageRepository.list((vintage) => vintage.branchId === activeBranch.id);
  }, [activeBranch, version]);

  const countByLabel = useMemo(() => {
    const map = new Map<VintageLabel, number>();
    vintages.forEach((vintage) => map.set(vintage.label, (map.get(vintage.label) ?? 0) + 1));
    return map;
  }, [vintages]);

  const availableSegments = useMemo(
    () => SEGMENT_ORDER.filter((label) => (countByLabel.get(label) ?? 0) > 0),
    [countByLabel],
  );
  const [activeLabel, setActiveLabel] = useState<VintageLabel | null>(null);
  const currentLabel = useMemo(() => {
    if (activeLabel && availableSegments.includes(activeLabel)) return activeLabel;
    return availableSegments[0] ?? null;
  }, [activeLabel, availableSegments]);

  const rows = useMemo(() => {
    if (!currentLabel) return [];
    return vintages
      .filter((vintage) => vintage.label === currentLabel)
      .map((vintage) => ({ vintage, wine: wineById.get(vintage.wineId) }))
      .filter((row): row is { vintage: WineVintage; wine: Wine } => Boolean(row.wine))
      .sort((a, b) => a.wine.name.localeCompare(b.wine.name));
  }, [vintages, currentLabel, wineById]);

  function handleAdjust(input: { type: MovementType; quantity: number; reason: string }) {
    if (!adjusting || !activeBranch) return;
    const { vintage } = adjusting;
    const delta = input.type === 'entrada' ? input.quantity : -input.quantity;
    vintageRepository.update(vintage.id, { stockBottles: vintage.stockBottles + delta });

    movementRepository.create({
      id: generateId('mov'),
      branchId: activeBranch.id,
      vintageId: vintage.id,
      type: input.type,
      quantity: input.quantity,
      reason: input.reason,
      date: new Date().toISOString().slice(0, 10),
    });

    setAdjusting(null);
    setVersion((v) => v + 1);
  }

  return (
    <div>
      <PageHeader
        title="Vinos y añejados"
        subtitle={activeBranch ? `Catálogo disponible en ${activeBranch.name}` : undefined}
      />

      {availableSegments.length === 0 ? (
        <EmptyState title="Sin vinos cargados" description="Esta sucursal todavía no tiene añejados asignados." />
      ) : (
        <>
          <SegmentedControl
            ariaLabel="Categoría de añejamiento"
            segments={availableSegments.map((label) => ({
              value: label,
              label: VINTAGE_LABEL_TEXT[label],
              count: countByLabel.get(label),
            }))}
            value={currentLabel ?? availableSegments[0]}
            onChange={setActiveLabel}
          />

          {rows.length === 0 ? (
            <div className={styles.tableWrap}>
              <EmptyState
                title="Sin botellas en esta categoría"
                description="No hay añejados registrados para este segmento en la sucursal activa."
              />
            </div>
          ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <caption className="visually-hidden">
                Añejados en categoría {currentLabel ? VINTAGE_LABEL_TEXT[currentLabel] : ''}
              </caption>
              <thead>
                <tr>
                  <th scope="col">Vino</th>
                  <th scope="col">Varietal</th>
                  <th scope="col">SKU</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Stock</th>
                  <th scope="col">Estado</th>
                  <th scope="col">
                    <span className="visually-hidden">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ vintage, wine }) => {
                  const isOut = vintage.stockBottles <= 0;
                  const isLow = !isOut && vintage.stockBottles <= vintage.lowStockThreshold;
                  return (
                    <tr key={vintage.id} className={isOut ? styles.rowOut : undefined}>
                      <td>
                        <span className={styles.wineName}>{wine.name}</span>
                        <span className={styles.wineType}>{WINE_TYPE_TEXT[wine.type]}</span>
                      </td>
                      <td>{wine.varietal}</td>
                      <td className={styles.sku}>{vintage.sku}</td>
                      <td>{formatCurrency(vintage.price)}</td>
                      <td>{formatNumber(vintage.stockBottles)}</td>
                      <td>
                        {isOut ? (
                          <Badge tone="neutral">Agotado</Badge>
                        ) : isLow ? (
                          <Badge tone="danger">Stock bajo</Badge>
                        ) : (
                          <Badge tone="success">Disponible</Badge>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.adjustButton}
                          onClick={() => setAdjusting({ vintage, wine })}
                        >
                          <SlidersHorizontal size={14} />
                          Ajustar stock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          )}
        </>
      )}

      {adjusting ? (
        <Modal title="Ajuste de stock" onClose={() => setAdjusting(null)}>
          <StockAdjustmentForm
            vintage={adjusting.vintage}
            wineName={adjusting.wine.name}
            onCancel={() => setAdjusting(null)}
            onSubmit={handleAdjust}
          />
        </Modal>
      ) : null}
    </div>
  );
}
