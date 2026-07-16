import { offlineService } from "./offlineService";
import { networkService } from "./networkService";
import { saleService } from "../saleService";
import { productService } from "../productService";
import { supplierService } from "../supplierService";
import { queryClient } from "../../queries/queryClient";

type SyncListener = (syncing: boolean, pending: number) => void;

class SyncService {
  private listeners: SyncListener[] = [];
  private _isSyncing = false;
  private _pendingCount = 0;
  private unsubscribeNetwork: (() => void) | null = null;

  get isSyncing() {
    return this._isSyncing;
  }
  get pendingCount() {
    return this._pendingCount;
  }

  start() {
    this.unsubscribeNetwork = networkService.onStatusChange((online) => {
      if (online) {
        setTimeout(() => this.syncAll(), 500);
      }
    });
    this.updatePendingCount();
    if (networkService.isOnline) {
      this.syncAll();
    }
  }

  stop() {
    this.unsubscribeNetwork?.();
  }

  onSyncChange(fn: SyncListener): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this._isSyncing, this._pendingCount));
  }

  private async updatePendingCount() {
    const pending = await offlineService.sync.getPending();
    this._pendingCount = pending.length;
    this.notify();
  }

  async syncAll() {
    if (this._isSyncing || !networkService.isOnline) return;

    this._isSyncing = true;
    this.notify();

    try {
      const pending = await offlineService.sync.getPending();

      for (const entry of pending) {
        try {
          await this.processEntry(entry);
          await offlineService.sync.markSynced(entry.id);
          this._pendingCount = Math.max(0, this._pendingCount - 1);
          this.notify();
        } catch (err) {
          console.error(`Sync failed for entry ${entry.id}:`, err);
          break;
        }
      }

      await this.refreshFromServer();
      await offlineService.sync.clearSynced();
      this._pendingCount = 0;
      this.notify();

      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["sales"] });
      await queryClient.invalidateQueries({ queryKey: ["history"] });
      await queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      this._isSyncing = false;
      this.notify();
    }
  }

  private async processEntry(entry: {
    table: string;
    operation: string;
    recordId: number | null;
    data: unknown;
  }) {
    const { table, operation, recordId, data } = entry;

    switch (table) {
      case "products":
        if (operation === "create") {
          await productService.createProduct(
            data as Parameters<typeof productService.createProduct>[0]
          );
        } else if (operation === "update" && recordId) {
          await productService.updateProduct(
            recordId,
            data as Parameters<typeof productService.updateProduct>[1]
          );
        } else if (operation === "delete" && recordId) {
          await productService.deleteProduct(recordId);
        }
        break;

      case "sales":
        if (operation === "create") {
          await saleService.createSale(
            data as Parameters<typeof saleService.createSale>[0]
          );
        }
        break;

      case "suppliers":
        if (operation === "create") {
          await supplierService.createSupplier(
            data as Parameters<typeof supplierService.createSupplier>[0]
          );
        } else if (operation === "update" && recordId) {
          await supplierService.updateSupplier(
            recordId,
            data as Parameters<typeof supplierService.updateSupplier>[1]
          );
        } else if (operation === "delete" && recordId) {
          await supplierService.deleteSupplier(recordId);
        }
        break;
    }
  }

  private async refreshFromServer() {
    try {
      const [products, sales, suppliers] = await Promise.all([
        productService.getProducts(),
        saleService.getSales(),
        supplierService.getSuppliers(),
      ]);

      await Promise.all([
        offlineService.products.save(products),
        offlineService.sales.save(sales),
        offlineService.suppliers.save(suppliers),
      ]);
    } catch (err) {
      console.error("Failed to refresh from server:", err);
    }
  }
}

export const syncService = new SyncService();
