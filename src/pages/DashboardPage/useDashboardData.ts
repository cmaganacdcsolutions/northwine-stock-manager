import { useMemo } from 'react';
import {
  barrelRepository,
  orderRepository,
  supplierRepository,
  vintageRepository,
  wineRepository,
} from '../../data/repository';
import type { WineType } from '../../data/types';
import { daysUntil } from '../../lib/format';

export interface LowStockAlert {
  vintageId: string;
  wineName: string;
  label: string;
  stockBottles: number;
  lowStockThreshold: number;
}

export interface ArrivalAlert {
  orderId: string;
  supplierName: string;
  etaDate: string;
  daysUntilArrival: number;
}

export interface DashboardData {
  litersInBarrel: number;
  bottlesInStock: number;
  barrelsReadyToBottle: number;
  ordersInTransit: number;
  inventoryValue: number;
  stockByType: { type: WineType; label: string; bottles: number }[];
  lowStockAlerts: LowStockAlert[];
  upcomingArrivals: ArrivalAlert[];
}

const TYPE_LABEL: Record<WineType, string> = {
  tinto: 'Tinto',
  blanco: 'Blanco',
  rosado: 'Rosado',
};

export function useDashboardData(branchId: string | undefined): DashboardData {
  return useMemo<DashboardData>(() => {
    if (!branchId) {
      return {
        litersInBarrel: 0,
        bottlesInStock: 0,
        barrelsReadyToBottle: 0,
        ordersInTransit: 0,
        inventoryValue: 0,
        stockByType: [],
        lowStockAlerts: [],
        upcomingArrivals: [],
      };
    }

    const barrels = barrelRepository.list((barrel) => barrel.branchId === branchId);
    const vintages = vintageRepository.list((vintage) => vintage.branchId === branchId);
    const wines = wineRepository.list();
    const orders = orderRepository.list((order) => order.branchId === branchId);

    const wineById = new Map(wines.map((wine) => [wine.id, wine]));
    const supplierById = new Map(supplierRepository.list().map((supplier) => [supplier.id, supplier]));

    const litersInBarrel = barrels.reduce((sum, barrel) => sum + barrel.currentLiters, 0);
    const bottlesInStock = vintages.reduce((sum, vintage) => sum + vintage.stockBottles, 0);
    const barrelsReadyToBottle = barrels.filter((barrel) => barrel.status === 'listo').length;
    const ordersInTransit = orders.filter((order) => order.status === 'en_transito').length;
    const inventoryValue = vintages.reduce((sum, vintage) => sum + vintage.price * vintage.stockBottles, 0);

    const byType = new Map<WineType, number>([
      ['tinto', 0],
      ['blanco', 0],
      ['rosado', 0],
    ]);
    vintages.forEach((vintage) => {
      const wine = wineById.get(vintage.wineId);
      if (!wine) return;
      byType.set(wine.type, (byType.get(wine.type) ?? 0) + vintage.stockBottles);
    });
    const stockByType = Array.from(byType.entries()).map(([type, bottles]) => ({
      type,
      label: TYPE_LABEL[type],
      bottles,
    }));

    const lowStockAlerts: LowStockAlert[] = vintages
      .filter((vintage) => vintage.stockBottles <= vintage.lowStockThreshold)
      .map((vintage) => ({
        vintageId: vintage.id,
        wineName: wineById.get(vintage.wineId)?.name ?? 'Vino',
        label: vintage.label,
        stockBottles: vintage.stockBottles,
        lowStockThreshold: vintage.lowStockThreshold,
      }))
      .sort((a, b) => a.stockBottles - b.stockBottles);

    const supplierRepositoryOrders = orders.filter(
      (order) => order.status === 'en_transito' || order.status === 'enviada',
    );

    const upcomingArrivals: ArrivalAlert[] = supplierRepositoryOrders
      .map((order) => ({
        orderId: order.id,
        supplierName: supplierById.get(order.supplierId)?.name ?? 'Proveedor',
        etaDate: order.etaDate,
        daysUntilArrival: daysUntil(order.etaDate),
      }))
      .filter((arrival) => arrival.daysUntilArrival <= 14)
      .sort((a, b) => a.daysUntilArrival - b.daysUntilArrival);

    return {
      litersInBarrel,
      bottlesInStock,
      barrelsReadyToBottle,
      ordersInTransit,
      inventoryValue,
      stockByType,
      lowStockAlerts,
      upcomingArrivals,
    };
  }, [branchId]);
}
