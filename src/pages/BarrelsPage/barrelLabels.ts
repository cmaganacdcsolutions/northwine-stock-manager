import type { BarrelStatus, OakType, WineType } from '../../data/types';

export const WINE_TYPE_LABEL: Record<WineType, string> = {
  tinto: 'Tinto',
  blanco: 'Blanco',
  rosado: 'Rosado',
};

export const OAK_TYPE_LABEL: Record<OakType, string> = {
  frances: 'Roble francés',
  americano: 'Roble americano',
};

export const BARREL_STATUS_LABEL: Record<BarrelStatus, string> = {
  // Display copy aligned with STOCK_MANAGER_SPEC.md §4 ("En crianza"); the
  // BarrelStatus enum value itself stays `añejando` (data shape unchanged).
  añejando: 'En crianza',
  listo: 'Listo',
  vacío: 'Vacío',
};

export const BARREL_STATUS_TONE: Record<BarrelStatus, 'info' | 'success' | 'neutral'> = {
  añejando: 'info',
  listo: 'success',
  vacío: 'neutral',
};
