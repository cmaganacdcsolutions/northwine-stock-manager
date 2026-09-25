import type { SupplierOrder } from '../types';
import { isoOffset } from './dateUtil';

const BODEGA = 'branch-bodega-principal';
const CENTRO = 'branch-tienda-centro';
const COSTA = 'branch-sala-cata-costa';
const NORTE = 'branch-tienda-norte';

export const seedOrders: SupplierOrder[] = [
  {
    id: 'order-001',
    branchId: BODEGA,
    supplierId: 'sup-tonelera-sur',
    status: 'en_transito',
    createdDate: isoOffset(-12),
    etaDate: isoOffset(3),
    items: [
      { id: 'item-001-1', description: 'Barrica roble francés 225L', quantity: 10, unit: 'unidad', unitCost: 850 },
    ],
  },
  {
    id: 'order-002',
    branchId: BODEGA,
    supplierId: 'sup-corchos-andinos',
    status: 'en_transito',
    createdDate: isoOffset(-8),
    // Overdue ETA on purpose (QA_REPORT.md P1-2): with the seed's original
    // etaDate: isoOffset(1), no order ever demoed the "Retrasada" badge
    // (see OrderCard.tsx isDelayed = canReceive && days < 0). Bodega
    // Principal is the demo's default branch, so this is visible right away.
    etaDate: isoOffset(-2),
    items: [
      { id: 'item-002-1', description: 'Corcho natural 45mm', quantity: 20000, unit: 'unidad', unitCost: 0.35 },
    ],
  },
  {
    id: 'order-003',
    branchId: BODEGA,
    supplierId: 'sup-vidrios-cuyo',
    status: 'en_transito',
    createdDate: isoOffset(-15),
    etaDate: isoOffset(6),
    items: [
      { id: 'item-003-1', description: 'Botella Bordalesa 750ml verde', quantity: 15000, unit: 'unidad', unitCost: 0.62 },
    ],
  },
  {
    id: 'order-004',
    branchId: CENTRO,
    supplierId: 'sup-etiquetas-premium',
    status: 'enviada',
    createdDate: isoOffset(-4),
    etaDate: isoOffset(9),
    items: [
      { id: 'item-004-1', description: 'Etiqueta frontal línea Reserva', quantity: 8000, unit: 'unidad', unitCost: 0.18 },
      { id: 'item-004-2', description: 'Contraetiqueta línea Reserva', quantity: 8000, unit: 'unidad', unitCost: 0.12 },
    ],
  },
  {
    id: 'order-005',
    branchId: BODEGA,
    supplierId: 'sup-vinedos-asociados',
    status: 'borrador',
    createdDate: isoOffset(-1),
    etaDate: isoOffset(25),
    items: [
      { id: 'item-005-1', description: 'Uva Malbec (cosecha próxima)', quantity: 4000, unit: 'kg', unitCost: 1.1 },
    ],
  },
  {
    id: 'order-006',
    branchId: COSTA,
    supplierId: 'sup-etiquetas-premium',
    status: 'recibida',
    createdDate: isoOffset(-30),
    etaDate: isoOffset(-18),
    receivedDate: isoOffset(-17),
    items: [
      { id: 'item-006-1', description: 'Etiqueta línea Rosé', quantity: 3000, unit: 'unidad', unitCost: 0.2 },
    ],
  },
  {
    id: 'order-007',
    branchId: NORTE,
    supplierId: 'sup-vidrios-cuyo',
    status: 'recibida',
    createdDate: isoOffset(-40),
    etaDate: isoOffset(-25),
    receivedDate: isoOffset(-24),
    items: [
      { id: 'item-007-1', description: 'Botella Borgoña 750ml transparente', quantity: 5000, unit: 'unidad', unitCost: 0.58 },
    ],
  },
  {
    id: 'order-008',
    branchId: BODEGA,
    supplierId: 'sup-tonelera-sur',
    status: 'enviada',
    createdDate: isoOffset(-3),
    etaDate: isoOffset(14),
    items: [
      { id: 'item-008-1', description: 'Barrica roble americano 225L', quantity: 6, unit: 'unidad', unitCost: 620 },
    ],
  },
];
