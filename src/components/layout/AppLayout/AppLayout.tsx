import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../Sidebar/Sidebar';
import { Header } from '../Header/Header';
import { Spinner } from '../../atoms/Spinner/Spinner';
import { ErrorBoundary } from '../../organisms/ErrorBoundary/ErrorBoundary';
import { useBranch } from '../../../context/BranchContext';
import styles from './AppLayout.module.css';

const BRANCH_SWITCH_DELAY_MS = 220;

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activeBranch } = useBranch();
  const location = useLocation();

  // Brief "loading" beat whenever the active sucursal changes, so every
  // branch-scoped view goes through loading -> success like it would
  // against a real API, instead of jump-cutting between datasets. The flag
  // flips to true during render (React's documented pattern for "adjusting
  // state when a prop changes") and back to false from a timeout, so the
  // effect body itself never calls setState synchronously.
  const [loadingBranch, setLoadingBranch] = useState(false);
  const lastBranchId = useRef(activeBranch?.id);
  if (lastBranchId.current !== activeBranch?.id) {
    lastBranchId.current = activeBranch?.id;
    setLoadingBranch(true);
  }

  useEffect(() => {
    if (!loadingBranch) return;
    const timer = window.setTimeout(() => setLoadingBranch(false), BRANCH_SWITCH_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [loadingBranch]);

  return (
    <div className={styles.shell}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={styles.main}>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className={styles.content}>
          <ErrorBoundary key={location.pathname}>
            {loadingBranch ? <Spinner label="Cargando sucursal…" /> : <Outlet />}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
