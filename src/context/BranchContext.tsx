import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Branch } from '../data/types';
import { branchRepository } from '../data/repository';

const BRANCH_KEY = 'nw:active-branch';

interface BranchContextValue {
  branches: Branch[];
  activeBranch: Branch | null;
  setActiveBranchId: (id: string) => void;
  clearActiveBranch: () => void;
}

const BranchContext = createContext<BranchContextValue | undefined>(undefined);

export function BranchProvider({ children }: { children: ReactNode }) {
  const [branches] = useState<Branch[]>(() => branchRepository.list());
  const [activeBranchId, setActiveBranchIdState] = useState<string | null>(() =>
    window.sessionStorage.getItem(BRANCH_KEY),
  );

  const setActiveBranchId = useCallback((id: string) => {
    window.sessionStorage.setItem(BRANCH_KEY, id);
    setActiveBranchIdState(id);
  }, []);

  const clearActiveBranch = useCallback(() => {
    window.sessionStorage.removeItem(BRANCH_KEY);
    setActiveBranchIdState(null);
  }, []);

  const activeBranch = useMemo(
    () => branches.find((branch) => branch.id === activeBranchId) ?? null,
    [branches, activeBranchId],
  );

  const value = useMemo<BranchContextValue>(
    () => ({ branches, activeBranch, setActiveBranchId, clearActiveBranch }),
    [branches, activeBranch, setActiveBranchId, clearActiveBranch],
  );

  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>;
}

export function useBranch(): BranchContextValue {
  const ctx = useContext(BranchContext);
  if (!ctx) throw new Error('useBranch debe usarse dentro de BranchProvider');
  return ctx;
}
