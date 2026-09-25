import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useBranch } from '../../context/BranchContext';
import { barrelRepository } from '../../data/repository';
import type { Barrel, BarrelStatus, WineType } from '../../data/types';
import { generateId } from '../../lib/id';
import { PageHeader } from '../../components/molecules/PageHeader/PageHeader';
import { Button } from '../../components/atoms/Button/Button';
import { Modal } from '../../components/molecules/Modal/Modal';
import { EmptyState } from '../../components/molecules/StateView/StateView';
import { BarrelCard } from '../../components/organisms/BarrelCard/BarrelCard';
import { BarrelForm } from '../../components/organisms/BarrelForm/BarrelForm';
import inputStyles from '../../components/atoms/inputs.module.css';
import { BARREL_STATUS_LABEL, WINE_TYPE_LABEL } from './barrelLabels';
import styles from './BarrelsPage.module.css';

type StatusFilter = BarrelStatus | 'todos';
type TypeFilter = WineType | 'todos';

export function BarrelsPage() {
  const { activeBranch } = useBranch();
  const [version, setVersion] = useState(0);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('todos');
  const [editingBarrel, setEditingBarrel] = useState<Barrel | 'new' | null>(null);

  const barrels = useMemo(() => {
    if (!activeBranch) return [];
    // `version` forces recompute after create/update since the repository is not reactive on its own.
    void version;
    return barrelRepository
      .list((barrel) => barrel.branchId === activeBranch.id)
      .filter((barrel) => statusFilter === 'todos' || barrel.status === statusFilter)
      .filter((barrel) => typeFilter === 'todos' || barrel.wineType === typeFilter)
      .sort((a, b) => a.code.localeCompare(b.code));
  }, [activeBranch, statusFilter, typeFilter, version]);

  function handleCreate(values: Omit<Barrel, 'id' | 'branchId'>) {
    if (!activeBranch) return;
    barrelRepository.create({ id: generateId('barrel'), branchId: activeBranch.id, ...values });
    setVersion((v) => v + 1);
    setEditingBarrel(null);
  }

  function handleUpdate(id: string, values: Omit<Barrel, 'id' | 'branchId'>) {
    barrelRepository.update(id, values);
    setVersion((v) => v + 1);
    setEditingBarrel(null);
  }

  const isEditing = editingBarrel !== null && editingBarrel !== 'new';

  return (
    <div>
      <PageHeader
        title="Barriles"
        subtitle={activeBranch ? `${barrels.length} barriles en ${activeBranch.name}` : undefined}
        actions={
          <Button icon={<Plus size={16} />} onClick={() => setEditingBarrel('new')}>
            Nuevo barril
          </Button>
        }
      />

      <div className={styles.filters}>
        <select
          className={inputStyles.select}
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value as TypeFilter)}
          aria-label="Filtrar por tipo de vino"
        >
          <option value="todos">Todos los tipos</option>
          {(Object.keys(WINE_TYPE_LABEL) as WineType[]).map((type) => (
            <option key={type} value={type}>
              {WINE_TYPE_LABEL[type]}
            </option>
          ))}
        </select>

        <select
          className={inputStyles.select}
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          aria-label="Filtrar por estado"
        >
          <option value="todos">Todos los estados</option>
          {(Object.keys(BARREL_STATUS_LABEL) as BarrelStatus[]).map((status) => (
            <option key={status} value={status}>
              {BARREL_STATUS_LABEL[status]}
            </option>
          ))}
        </select>
      </div>

      {barrels.length === 0 ? (
        <EmptyState
          title="No hay barriles con estos filtros"
          description="Probá cambiar los filtros o cargá un nuevo barril."
        />
      ) : (
        <div className={styles.grid}>
          {barrels.map((barrel) => (
            <BarrelCard key={barrel.id} barrel={barrel} onEdit={() => setEditingBarrel(barrel)} />
          ))}
        </div>
      )}

      {editingBarrel ? (
        <Modal title={isEditing ? 'Editar barril' : 'Nuevo barril'} onClose={() => setEditingBarrel(null)}>
          <BarrelForm
            initialValue={isEditing ? (editingBarrel as Barrel) : undefined}
            onCancel={() => setEditingBarrel(null)}
            onSubmit={(values) =>
              isEditing ? handleUpdate((editingBarrel as Barrel).id, values) : handleCreate(values)
            }
          />
        </Modal>
      ) : null}
    </div>
  );
}
