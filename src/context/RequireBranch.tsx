import { Navigate, Outlet } from 'react-router-dom';
import { useBranch } from './BranchContext';

/** Blocks access to branch-scoped routes until a sucursal has been chosen. */
export function RequireBranch() {
  const { activeBranch } = useBranch();

  if (!activeBranch) {
    return <Navigate to="/sucursales" replace />;
  }

  return <Outlet />;
}
