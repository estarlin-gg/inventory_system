import { openDB, IDBPDatabase } from "idb";
import { Product } from "../../models/product";
import { Sale } from "../../models/sale";
import { Supplier } from "../../models/supplier";

export interface SyncQueueEntry {
  id: string;
  table: "products" | "sales" | "suppliers";
  operation: "create" | "update" | "delete";
  recordId: number | null;
  data: unknown;
  timestamp: number;
  synced: boolean;
}

export interface AuthStore {
  key: string;
  user: unknown;
}

interface InventoryDB {
  products: {
    key: number;
    value: Product;
    indexes: { "by-name": string };
  };
  sales: {
    key: number;
    value: Sale;
    indexes: { "by-date": string };
  };
  suppliers: {
    key: number;
    value: Supplier;
    indexes: { "by-name": string };
  };
  syncQueue: {
    key: string;
    value: SyncQueueEntry;
    indexes: { "by-synced": number };
  };
  auth: {
    key: string;
    value: AuthStore;
  };
}

let dbInstance: IDBPDatabase<InventoryDB> | null = null;

export const getDB = async (): Promise<IDBPDatabase<InventoryDB>> => {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<InventoryDB>("inventory_offline", 1, {
    upgrade(db) {
      const productStore = db.createObjectStore("products", {
        keyPath: "product_id",
      });
      productStore.createIndex("by-name", "product_name");

      const saleStore = db.createObjectStore("sales", {
        keyPath: "id",
      });
      saleStore.createIndex("by-date", "created_at");

      const supplierStore = db.createObjectStore("suppliers", {
        keyPath: "supplier_id",
      });
      supplierStore.createIndex("by-name", "name");

      const syncStore = db.createObjectStore("syncQueue", { keyPath: "id" });
      syncStore.createIndex("by-synced", "synced");

      db.createObjectStore("auth", { keyPath: "key" });
    },
  });

  return dbInstance;
};
