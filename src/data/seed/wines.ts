import type { Wine, WineVintage } from '../types';

const BODEGA = 'branch-bodega-principal';
const CENTRO = 'branch-tienda-centro';
const COSTA = 'branch-sala-cata-costa';
const NORTE = 'branch-tienda-norte';

/** DEMO catalog — generic names, not real North Wine products. */
export const seedWines: Wine[] = [
  {
    id: 'wine-malbec-gran-reserva',
    name: 'Gran Reserva Malbec (DEMO)',
    type: 'tinto',
    varietal: 'Malbec',
    description: 'Guarda prolongada en roble francés, notas a fruta negra y especias.',
  },
  {
    id: 'wine-cabernet-reserva',
    name: 'Cabernet Sauvignon Reserva (DEMO)',
    type: 'tinto',
    varietal: 'Cabernet Sauvignon',
    description: 'Estructura firme, taninos maduros, crianza en roble americano.',
  },
  {
    id: 'wine-blend-premium',
    name: 'Blend Tinto Premium (DEMO)',
    type: 'tinto',
    varietal: 'Malbec / Cabernet / Syrah',
    description: 'Ensamble de tres varietales, edición limitada de la línea premium.',
  },
  {
    id: 'wine-chardonnay-barrica',
    name: 'Chardonnay Barrica (DEMO)',
    type: 'blanco',
    varietal: 'Chardonnay',
    description: 'Fermentado y criado en barrica, untuoso con notas a vainilla.',
  },
  {
    id: 'wine-sauvignon-blanc',
    name: 'Sauvignon Blanc Joven (DEMO)',
    type: 'blanco',
    varietal: 'Sauvignon Blanc',
    description: 'Fresco y aromático, sin paso por madera, consumo joven.',
  },
  {
    id: 'wine-rose-pinot',
    name: 'Rosé de Pinot Noir (DEMO)',
    type: 'rosado',
    varietal: 'Pinot Noir',
    description: 'Rosado de sangrado corto, ligero y frutal.',
  },
];

export const seedVintages: WineVintage[] = [
  // Gran Reserva Malbec
  { id: 'vint-mal-joven-bod', wineId: 'wine-malbec-gran-reserva', branchId: BODEGA, label: 'reserva_joven', sku: 'NW-MAL-RJ-BOD', price: 18, stockBottles: 480, lowStockThreshold: 100 },
  { id: 'vint-mal-10-bod', wineId: 'wine-malbec-gran-reserva', branchId: BODEGA, label: '10', sku: 'NW-MAL-10-BOD', price: 42, stockBottles: 210, lowStockThreshold: 60 },
  { id: 'vint-mal-20-bod', wineId: 'wine-malbec-gran-reserva', branchId: BODEGA, label: '20', sku: 'NW-MAL-20-BOD', price: 95, stockBottles: 64, lowStockThreshold: 30 },
  { id: 'vint-mal-joven-cen', wineId: 'wine-malbec-gran-reserva', branchId: CENTRO, label: 'reserva_joven', sku: 'NW-MAL-RJ-CEN', price: 20, stockBottles: 36, lowStockThreshold: 24 },
  { id: 'vint-mal-joven-nor', wineId: 'wine-malbec-gran-reserva', branchId: NORTE, label: 'reserva_joven', sku: 'NW-MAL-RJ-NOR', price: 20, stockBottles: 18, lowStockThreshold: 24 },

  // Cabernet Sauvignon Reserva
  { id: 'vint-cab-10-bod', wineId: 'wine-cabernet-reserva', branchId: BODEGA, label: '10', sku: 'NW-CAB-10-BOD', price: 38, stockBottles: 150, lowStockThreshold: 50 },
  { id: 'vint-cab-20-bod', wineId: 'wine-cabernet-reserva', branchId: BODEGA, label: '20', sku: 'NW-CAB-20-BOD', price: 88, stockBottles: 40, lowStockThreshold: 20 },
  { id: 'vint-cab-25-bod', wineId: 'wine-cabernet-reserva', branchId: BODEGA, label: '25', sku: 'NW-CAB-25-BOD', price: 140, stockBottles: 22, lowStockThreshold: 15 },
  { id: 'vint-cab-10-cen', wineId: 'wine-cabernet-reserva', branchId: CENTRO, label: '10', sku: 'NW-CAB-10-CEN', price: 42, stockBottles: 20, lowStockThreshold: 18 },
  { id: 'vint-cab-10-cos', wineId: 'wine-cabernet-reserva', branchId: COSTA, label: '10', sku: 'NW-CAB-10-COS', price: 42, stockBottles: 8, lowStockThreshold: 15 },

  // Blend Tinto Premium
  { id: 'vint-blend-joven-bod', wineId: 'wine-blend-premium', branchId: BODEGA, label: 'reserva_joven', sku: 'NW-BLD-RJ-BOD', price: 24, stockBottles: 300, lowStockThreshold: 80 },
  { id: 'vint-blend-10-bod', wineId: 'wine-blend-premium', branchId: BODEGA, label: '10', sku: 'NW-BLD-10-BOD', price: 55, stockBottles: 90, lowStockThreshold: 30 },
  { id: 'vint-blend-joven-nor', wineId: 'wine-blend-premium', branchId: NORTE, label: 'reserva_joven', sku: 'NW-BLD-RJ-NOR', price: 26, stockBottles: 14, lowStockThreshold: 20 },

  // Chardonnay Barrica
  { id: 'vint-char-joven-bod', wineId: 'wine-chardonnay-barrica', branchId: BODEGA, label: 'reserva_joven', sku: 'NW-CHA-RJ-BOD', price: 16, stockBottles: 260, lowStockThreshold: 70 },
  { id: 'vint-char-10-bod', wineId: 'wine-chardonnay-barrica', branchId: BODEGA, label: '10', sku: 'NW-CHA-10-BOD', price: 34, stockBottles: 55, lowStockThreshold: 25 },
  { id: 'vint-char-joven-cen', wineId: 'wine-chardonnay-barrica', branchId: CENTRO, label: 'reserva_joven', sku: 'NW-CHA-RJ-CEN', price: 18, stockBottles: 30, lowStockThreshold: 20 },
  { id: 'vint-char-joven-cos', wineId: 'wine-chardonnay-barrica', branchId: COSTA, label: 'reserva_joven', sku: 'NW-CHA-RJ-COS', price: 18, stockBottles: 12, lowStockThreshold: 20 },

  // Sauvignon Blanc Joven
  { id: 'vint-sauv-joven-bod', wineId: 'wine-sauvignon-blanc', branchId: BODEGA, label: 'reserva_joven', sku: 'NW-SAU-RJ-BOD', price: 14, stockBottles: 320, lowStockThreshold: 80 },
  { id: 'vint-sauv-joven-cen', wineId: 'wine-sauvignon-blanc', branchId: CENTRO, label: 'reserva_joven', sku: 'NW-SAU-RJ-CEN', price: 16, stockBottles: 48, lowStockThreshold: 25 },
  { id: 'vint-sauv-joven-nor', wineId: 'wine-sauvignon-blanc', branchId: NORTE, label: 'reserva_joven', sku: 'NW-SAU-RJ-NOR', price: 16, stockBottles: 9, lowStockThreshold: 25 },

  // Rosé de Pinot Noir
  { id: 'vint-rose-joven-bod', wineId: 'wine-rose-pinot', branchId: BODEGA, label: 'reserva_joven', sku: 'NW-ROS-RJ-BOD', price: 15, stockBottles: 180, lowStockThreshold: 50 },
  { id: 'vint-rose-joven-cos', wineId: 'wine-rose-pinot', branchId: COSTA, label: 'reserva_joven', sku: 'NW-ROS-RJ-COS', price: 17, stockBottles: 22, lowStockThreshold: 25 },
  { id: 'vint-rose-joven-nor', wineId: 'wine-rose-pinot', branchId: NORTE, label: 'reserva_joven', sku: 'NW-ROS-RJ-NOR', price: 17, stockBottles: 15, lowStockThreshold: 20 },
];
