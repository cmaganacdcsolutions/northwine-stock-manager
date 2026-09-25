import type { OrderStatus, SupplierCategory } from '../../data/types';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  borrador: 'Borrador',
  enviada: 'Enviada',
  en_transito: 'En tránsito',
  recibida: 'Recibida',
};

export const ORDER_STATUS_TONE: Record<OrderStatus, 'neutral' | 'info' | 'warning' | 'success'> = {
  borrador: 'neutral',
  enviada: 'info',
  en_transito: 'warning',
  recibida: 'success',
};

export const SUPPLIER_CATEGORY_LABEL: Record<SupplierCategory, string> = {
  barricas: 'Barricas',
  corchos: 'Corchos',
  botellas: 'Botellas',
  etiquetas: 'Etiquetas',
  uva: 'Uva',
};
