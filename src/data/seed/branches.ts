import type { Branch } from '../types';

export const seedBranches: Branch[] = [
  {
    id: 'branch-bodega-principal',
    name: 'Bodega Principal',
    kind: 'bodega',
    address: 'Ruta del Vino Km 12, Valle Central',
    isMain: true,
  },
  {
    id: 'branch-tienda-centro',
    name: 'Tienda Centro',
    kind: 'tienda',
    address: 'Av. Principal 480, Centro',
    isMain: false,
  },
  {
    id: 'branch-sala-cata-costa',
    name: 'Sala de Cata Costa',
    kind: 'sala_cata',
    address: 'Costanera 1200, Zona Costera',
    isMain: false,
  },
  {
    id: 'branch-tienda-norte',
    name: 'Tienda Norte',
    kind: 'tienda',
    address: 'Boulevard Norte 55, Distrito Norte',
    isMain: false,
  },
];
