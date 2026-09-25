import { useNavigate } from 'react-router-dom';
import { Menu, ChevronDown, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../auth/AuthContext';
import { useBranch } from '../../../context/BranchContext';
import styles from './Header.module.css';

interface HeaderProps {
  onMenuClick: () => void;
}

const BRANCH_KIND_LABEL: Record<string, string> = {
  bodega: 'Bodega',
  tienda: 'Tienda',
  sala_cata: 'Sala de cata',
};

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const { activeBranch, branches, setActiveBranchId } = useBranch();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setSwitcherOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelectBranch(id: string) {
    setActiveBranchId(id);
    setSwitcherOpen(false);
  }

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className={styles.header}>
      <button
        type="button"
        className={styles.menuButton}
        onClick={onMenuClick}
        aria-label="Abrir menú de navegación"
      >
        <Menu size={22} />
      </button>

      <div className={styles.branchSwitcher} ref={switcherRef}>
        <button
          type="button"
          className={styles.branchButton}
          onClick={() => setSwitcherOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={switcherOpen}
        >
          <span className={styles.branchLabel}>
            <span className={styles.branchKind}>
              {activeBranch ? BRANCH_KIND_LABEL[activeBranch.kind] : 'Sucursal'}
            </span>
            <span className={styles.branchName}>{activeBranch?.name ?? 'Seleccionar sucursal'}</span>
          </span>
          <ChevronDown size={16} />
        </button>
        {switcherOpen ? (
          <ul className={styles.branchList} role="listbox">
            {branches.map((branch) => (
              <li key={branch.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={branch.id === activeBranch?.id}
                  className={styles.branchOption}
                  onClick={() => handleSelectBranch(branch.id)}
                >
                  <span className={styles.branchKind}>{BRANCH_KIND_LABEL[branch.kind]}</span>
                  <span>{branch.name}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className={styles.userArea}>
        <span className={styles.userName}>{user}</span>
        <button type="button" className={styles.logoutButton} onClick={handleLogout} aria-label="Cerrar sesión">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
