import { Pencil } from 'lucide-react';
import type { Barrel } from '../../../data/types';
import { Badge } from '../../atoms/Badge/Badge';
import { ProgressBar } from '../../atoms/ProgressBar/ProgressBar';
import { ageLabel, formatDate, formatNumber } from '../../../lib/format';
import {
  BARREL_STATUS_LABEL,
  BARREL_STATUS_TONE,
  OAK_TYPE_LABEL,
  WINE_TYPE_LABEL,
} from '../../../pages/BarrelsPage/barrelLabels';
import styles from './BarrelCard.module.css';

interface BarrelCardProps {
  barrel: Barrel;
  onEdit: () => void;
}

export function BarrelCard({ barrel, onEdit }: BarrelCardProps) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div>
          <p className={styles.code}>{barrel.code}</p>
          <p className={styles.varietal}>
            {WINE_TYPE_LABEL[barrel.wineType]} · {barrel.varietal}
          </p>
        </div>
        <button type="button" className={styles.editButton} onClick={onEdit} aria-label={`Editar barril ${barrel.code}`}>
          <Pencil size={16} />
        </button>
      </header>

      <div className={styles.badgeRow}>
        <Badge tone={BARREL_STATUS_TONE[barrel.status]}>{BARREL_STATUS_LABEL[barrel.status]}</Badge>
        <Badge tone="neutral">{OAK_TYPE_LABEL[barrel.oakType]}</Badge>
      </div>

      <ProgressBar
        value={barrel.currentLiters}
        max={barrel.capacityLiters}
        label={`Llenado de ${barrel.code}`}
        tone={barrel.status === 'vacío' ? 'warning' : 'accent'}
      />
      <p className={styles.liters}>
        {formatNumber(barrel.currentLiters)} / {formatNumber(barrel.capacityLiters)} L
      </p>

      <dl className={styles.metaList}>
        <div className={styles.metaRow}>
          <dt>Llenado</dt>
          <dd>{formatDate(barrel.fillDate)}</dd>
        </div>
        <div className={styles.metaRow}>
          <dt>Edad</dt>
          <dd>{ageLabel(barrel.fillDate)}</dd>
        </div>
      </dl>

      {barrel.notes ? <p className={styles.notes}>{barrel.notes}</p> : null}
    </article>
  );
}
