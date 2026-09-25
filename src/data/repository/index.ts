import { createLocalStorageRepository, STORAGE_KEYS } from './storage';
import type { Barrel, Branch, Supplier, SupplierOrder, StockMovement, Wine, WineVintage } from '../types';

export const branchRepository = createLocalStorageRepository<Branch>(STORAGE_KEYS.branches);
export const barrelRepository = createLocalStorageRepository<Barrel>(STORAGE_KEYS.barrels);
export const wineRepository = createLocalStorageRepository<Wine>(STORAGE_KEYS.wines);
export const vintageRepository = createLocalStorageRepository<WineVintage>(STORAGE_KEYS.vintages);
export const supplierRepository = createLocalStorageRepository<Supplier>(STORAGE_KEYS.suppliers);
export const orderRepository = createLocalStorageRepository<SupplierOrder>(STORAGE_KEYS.orders);
export const movementRepository = createLocalStorageRepository<StockMovement>(STORAGE_KEYS.movements);

export { resetDemoData, ensureSeeded } from '../seed';
