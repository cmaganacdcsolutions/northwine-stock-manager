/**
 * Domain types for the North Wine Stock Manager demo.
 * All entities are branch-scoped (`branchId`) so every list/query can be
 * filtered by the active sucursal.
 */

export type BranchKind = 'bodega' | 'tienda' | 'sala_cata';

export interface Branch {
  id: string;
  name: string;
  kind: BranchKind;
  address: string;
  isMain: boolean;
}

export type WineType = 'tinto' | 'blanco' | 'rosado';

export type OakType = 'frances' | 'americano';

export type BarrelStatus = 'añejando' | 'listo' | 'vacío';

export interface Barrel {
  id: string;
  branchId: string;
  code: string;
  wineType: WineType;
  varietal: string;
  oakType: OakType;
  capacityLiters: number;
  currentLiters: number;
  fillDate: string; // ISO date, empty-capacity barrels may reuse last fill date
  status: BarrelStatus;
  notes?: string;
}

export type VintageLabel = 'reserva_joven' | '10' | '20' | '25';

export interface Wine {
  id: string;
  name: string;
  type: WineType;
  varietal: string;
  description: string;
}

export interface WineVintage {
  id: string;
  wineId: string;
  branchId: string;
  label: VintageLabel;
  sku: string;
  price: number;
  stockBottles: number;
  lowStockThreshold: number;
}

export type SupplierCategory = 'barricas' | 'corchos' | 'botellas' | 'etiquetas' | 'uva';

export interface Supplier {
  id: string;
  name: string;
  category: SupplierCategory;
}

export type OrderStatus = 'borrador' | 'enviada' | 'en_transito' | 'recibida';

export interface OrderItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
}

export interface SupplierOrder {
  id: string;
  branchId: string;
  supplierId: string;
  status: OrderStatus;
  createdDate: string;
  etaDate: string;
  receivedDate?: string;
  items: OrderItem[];
}

export type MovementType = 'entrada' | 'salida';

export interface StockMovement {
  id: string;
  branchId: string;
  vintageId: string;
  type: MovementType;
  quantity: number;
  reason: string;
  date: string;
}

export interface Entity {
  id: string;
}
