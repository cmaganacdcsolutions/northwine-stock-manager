import { useNavigate } from 'react-router-dom';
import { Building2, Store, GlassWater, ChevronRight, LogOut } from 'lucide-react';
import type { ComponentType } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useBranch } from '../../context/BranchContext';
import type { BranchKind } from '../../data/types';
import { EmptyState } from '../../components/molecules/StateView/StateView';
import styles from './BranchSelectPage.module.css';

const KIND_ICON: Record<BranchKind, ComponentType<{ size?: number }>> = {
  bodega: Building2,
  tienda: Store,
  sala_cata: GlassWater,
};

const KIND_LABEL: Record<BranchKind, string> = {
  bodega: 'Bodega',
  tienda: 'Tienda',
  sala_cata: 'Sala de cata',
};

export function BranchSelectPage() {
  const { branches, setActiveBranchId } = useBranch();
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleSelect(id: string) {
    setActiveBranchId(id);
    navigate('/dashboard', { replace: true });
  }

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <span className={styles.kicker}>Stock Manager</span>
          <h1 className={styles.title}>Elegí una sucursal</h1>
        </div>
        <button type="button" className={styles.logout} onClick={handleLogout}>
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </header>

      {branches.length === 0 ? (
        <EmptyState title="No hay sucursales cargadas" description="Restablecé los datos demo desde Ajustes." />
      ) : (
        <div className={styles.grid}>
          {branches.map((branch) => {
            const Icon = KIND_ICON[branch.kind];
            return (
              <button
                key={branch.id}
                type="button"
                className={styles.card}
                onClick={() => handleSelect(branch.id)}
              >
                <span className={styles.iconWrap}>
                  <Icon size={22} />
                </span>
                <span className={styles.cardBody}>
                  <span className={styles.cardKind}>{KIND_LABEL[branch.kind]}</span>
                  <span className={styles.cardName}>{branch.name}</span>
                  <span className={styles.cardAddress}>{branch.address}</span>
                </span>
                <ChevronRight size={18} className={styles.chevron} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
