import { useState } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useBranch } from '../../context/BranchContext';
import { resetDemoData } from '../../data/repository';
import { PageHeader } from '../../components/molecules/PageHeader/PageHeader';
import { Button } from '../../components/atoms/Button/Button';
import styles from './SettingsPage.module.css';

export function SettingsPage() {
  const { user } = useAuth();
  const { activeBranch } = useBranch();
  const [confirming, setConfirming] = useState(false);

  function handleReset() {
    resetDemoData();
    window.location.reload();
  }

  return (
    <div>
      <PageHeader title="Ajustes" subtitle="Configuración de la demo" />

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Sesión</h2>
        <dl className={styles.detailList}>
          <div className={styles.detailRow}>
            <dt>Usuario</dt>
            <dd>{user}</dd>
          </div>
          <div className={styles.detailRow}>
            <dt>Sucursal activa</dt>
            <dd>{activeBranch?.name ?? '—'}</dd>
          </div>
        </dl>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Datos demo</h2>
        <p className={styles.cardDescription}>
          Esta demo persiste todo en sessionStorage (se reinicia al cerrar la pestaña). Usá esta acción para descartar cualquier cambio hecho durante la
          presentación y volver al set de datos original.
        </p>

        {confirming ? (
          <div className={styles.confirmBox} role="alertdialog" aria-label="Confirmar restablecimiento">
            <p className={styles.confirmText}>
              <AlertTriangle size={16} aria-hidden="true" />
              Esto borra barriles, vinos, órdenes y movimientos cargados en esta demo. ¿Confirmás?
            </p>
            <div className={styles.confirmActions}>
              <Button variant="ghost" onClick={() => setConfirming(false)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleReset}>
                Sí, restablecer
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="secondary" icon={<RotateCcw size={16} />} onClick={() => setConfirming(true)}>
            Restablecer datos demo
          </Button>
        )}
      </section>
    </div>
  );
}
