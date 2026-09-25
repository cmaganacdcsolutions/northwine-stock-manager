import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Barrel as BarrelIcon,
  Wine,
  Truck,
  History,
  Settings,
  X,
} from 'lucide-react';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/barriles', label: 'Barriles', icon: BarrelIcon },
  { to: '/vinos', label: 'Vinos y añejados', icon: Wine },
  { to: '/ordenes', label: 'Órdenes a proveedor', icon: Truck },
  { to: '/movimientos', label: 'Movimientos', icon: History },
  { to: '/ajustes', label: 'Ajustes', icon: Settings },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open ? <div className={styles.backdrop} onClick={onClose} aria-hidden="true" /> : null}
      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`} aria-label="Navegación principal">
        <div className={styles.brandRow}>
          <span className={styles.brand}>North Wine</span>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>
        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
