import { STORAGE_KEYS, isSeeded, markSeeded, seedCollection, clearAllData } from '../repository/storage';
import { seedBranches } from './branches';
import { seedBarrels } from './barrels';
import { seedWines, seedVintages } from './wines';
import { seedSuppliers } from './suppliers';
import { seedOrders } from './orders';
import { seedMovements } from './movements';

function writeSeed(): void {
  seedCollection(STORAGE_KEYS.branches, seedBranches);
  seedCollection(STORAGE_KEYS.barrels, seedBarrels);
  seedCollection(STORAGE_KEYS.wines, seedWines);
  seedCollection(STORAGE_KEYS.vintages, seedVintages);
  seedCollection(STORAGE_KEYS.suppliers, seedSuppliers);
  seedCollection(STORAGE_KEYS.orders, seedOrders);
  seedCollection(STORAGE_KEYS.movements, seedMovements);
  markSeeded();
}

/** Seeds sessionStorage on first run of each session, or when the seed version changes. */
export function ensureSeeded(): void {
  if (isSeeded()) return;
  writeSeed();
}

/** Wipes all demo data and reseeds from scratch. Used by the "Restablecer datos demo" action. */
export function resetDemoData(): void {
  clearAllData();
  writeSeed();
}
