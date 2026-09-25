import type { Entity } from '../types';

/** Namespaced localStorage keys so a future API swap can't collide. */
export const STORAGE_KEYS = {
  branches: 'nw:branches',
  barrels: 'nw:barrels',
  wines: 'nw:wines',
  vintages: 'nw:vintages',
  suppliers: 'nw:suppliers',
  orders: 'nw:orders',
  movements: 'nw:movements',
  seedVersion: 'nw:seed-version',
} as const;

/** Bump when seed shape changes so returning demo users get fresh data. */
export const SEED_VERSION = '2';

function readCollection<T>(key: string): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function writeCollection<T>(key: string, items: T[]): void {
  window.localStorage.setItem(key, JSON.stringify(items));
}

export interface Repository<T extends Entity> {
  list: (predicate?: (item: T) => boolean) => T[];
  get: (id: string) => T | undefined;
  create: (item: T) => T;
  update: (id: string, patch: Partial<T>) => T | undefined;
}

/**
 * Generic CRUD repository backed by localStorage. Swappable later for a
 * real API client since callers only depend on the `Repository<T>` shape.
 */
export function createLocalStorageRepository<T extends Entity>(key: string): Repository<T> {
  return {
    list(predicate) {
      const items = readCollection<T>(key);
      return predicate ? items.filter(predicate) : items;
    },
    get(id) {
      return readCollection<T>(key).find((item) => item.id === id);
    },
    create(item) {
      const items = readCollection<T>(key);
      items.push(item);
      writeCollection(key, items);
      return item;
    },
    update(id, patch) {
      const items = readCollection<T>(key);
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) return undefined;
      const updated = { ...items[index], ...patch } as T;
      items[index] = updated;
      writeCollection(key, items);
      return updated;
    },
  };
}

export function seedCollection<T>(key: string, items: T[]): void {
  writeCollection(key, items);
}

export function isSeeded(): boolean {
  return window.localStorage.getItem(STORAGE_KEYS.seedVersion) === SEED_VERSION;
}

export function markSeeded(): void {
  window.localStorage.setItem(STORAGE_KEYS.seedVersion, SEED_VERSION);
}

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key));
}
