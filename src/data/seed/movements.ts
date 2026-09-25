import type { StockMovement } from '../types';
import { isoOffset } from './dateUtil';

const BODEGA = 'branch-bodega-principal';
const CENTRO = 'branch-tienda-centro';
const COSTA = 'branch-sala-cata-costa';
const NORTE = 'branch-tienda-norte';

export const seedMovements: StockMovement[] = [
  { id: 'mov-001', branchId: BODEGA, vintageId: 'vint-mal-10-bod', type: 'salida', quantity: 24, reason: 'Venta a distribuidor', date: isoOffset(-21) },
  { id: 'mov-002', branchId: BODEGA, vintageId: 'vint-mal-joven-bod', type: 'entrada', quantity: 200, reason: 'Embotellado lote BR-009', date: isoOffset(-18) },
  { id: 'mov-003', branchId: CENTRO, vintageId: 'vint-mal-joven-cen', type: 'salida', quantity: 12, reason: 'Venta mostrador', date: isoOffset(-15) },
  { id: 'mov-004', branchId: COSTA, vintageId: 'vint-cab-10-cos', type: 'salida', quantity: 6, reason: 'Cata degustación', date: isoOffset(-12) },
  { id: 'mov-005', branchId: BODEGA, vintageId: 'vint-char-10-bod', type: 'entrada', quantity: 55, reason: 'Ajuste de inventario', date: isoOffset(-9) },
  { id: 'mov-006', branchId: NORTE, vintageId: 'vint-sauv-joven-nor', type: 'salida', quantity: 10, reason: 'Venta mostrador', date: isoOffset(-6) },
  { id: 'mov-007', branchId: BODEGA, vintageId: 'vint-blend-joven-bod', type: 'salida', quantity: 40, reason: 'Venta a distribuidor', date: isoOffset(-4) },
  { id: 'mov-008', branchId: COSTA, vintageId: 'vint-rose-joven-cos', type: 'entrada', quantity: 15, reason: 'Traslado desde bodega', date: isoOffset(-2) },
];
