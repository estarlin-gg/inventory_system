import { getDB, SyncQueueEntry } from "./db";
import { Product, ProductCreate } from "../../models/product";
import { Sale } from "../../models/sale";
import { Supplier, SupplierCreate } from "../../models/supplier";

const generateId = (): string => {
  return crypto.randomUUID();
};

const enqueue = async (entry: Omit<SyncQueueEntry, "id" | "timestamp" | "synced">) => {
  const db = await getDB();
  await db.put("syncQueue", {
    ...entry,
    id: generateId(),
    timestamp: Date.now(),
    synced: false,
  });
};

// ─── PRODUCTS ────────────────────────────────────────────

const getProducts = async (): Promise<Product[]> => {
  const db = await getDB();
  return db.getAll("products");
};

const saveProducts = async (products: Product[]): Promise<void> => {
  const db = await getDB();
  const tx = db.transaction("products", "readwrite");
  await tx.store.clear();
  for (const p of products) {
    await tx.store.put(p);
  }
  await tx.done;
};

const createProduct = async (p: ProductCreate): Promise<Product> => {
  const db = await getDB();
  const all = await db.getAll("products");
  const maxId = all.reduce((max, prod) => Math.max(max, prod.product_id), 0);
  const newProduct: Product = {
    ...p,
    product_id: maxId + 1,
    final_price: p.discount
      ? p.price - p.price * (p.discount / 100)
      : p.price,
  };

  await db.put("products", newProduct);
  await enqueue({ table: "products", operation: "create", recordId: newProduct.product_id, data: p });
  return newProduct;
};

const updateProduct = async (id: number, p: Partial<ProductCreate>): Promise<Product> => {
  const db = await getDB();
  const existing = await db.get("products", id);
  if (!existing) throw new Error("Producto no encontrado");

  const updated: Product = {
    ...existing,
    ...p,
    final_price:
      p.price !== undefined
        ? p.discount
          ? p.price - p.price * (p.discount / 100)
          : p.price
        : existing.final_price,
  };

  await db.put("products", updated);
  await enqueue({ table: "products", operation: "update", recordId: id, data: p });
  return updated;
};

const deleteProduct = async (id: number): Promise<void> => {
  const db = await getDB();
  await db.delete("products", id);
  await enqueue({ table: "products", operation: "delete", recordId: id, data: null });
};

// ─── SALES ───────────────────────────────────────────────

const getSales = async (): Promise<Sale[]> => {
  const db = await getDB();
  return db.getAll("sales");
};

const normalizeSaleId = (s: Sale): Sale => {
  if (s.id == null) {
    return { ...s, id: (s as unknown as Record<string, unknown>).sale_id as number };
  }
  return s;
};

const saveSales = async (sales: Sale[]): Promise<void> => {
  const db = await getDB();
  const tx = db.transaction("sales", "readwrite");
  await tx.store.clear();
  for (const s of sales) {
    await tx.store.put(normalizeSaleId(s));
  }
  await tx.done;
};

const createSale = async (sale: Sale): Promise<Sale> => {
  const db = await getDB();
  const all = await db.getAll("sales");
  const maxId = all.reduce((max, s) => Math.max(max, s.id ?? 0), 0);
  const newSale: Sale = { ...sale, id: maxId + 1 };

  await db.put("sales", newSale);
  await enqueue({ table: "sales", operation: "create", recordId: newSale.id ?? null, data: sale });
  return newSale;
};

// ─── SUPPLIERS ───────────────────────────────────────────

const getSuppliers = async (): Promise<Supplier[]> => {
  const db = await getDB();
  return db.getAll("suppliers");
};

const saveSuppliers = async (suppliers: Supplier[]): Promise<void> => {
  const db = await getDB();
  const tx = db.transaction("suppliers", "readwrite");
  await tx.store.clear();
  for (const s of suppliers) {
    await tx.store.put(s);
  }
  await tx.done;
};

const createSupplier = async (s: SupplierCreate): Promise<Supplier> => {
  const db = await getDB();
  const all = await db.getAll("suppliers");
  const maxId = all.reduce((max, sup) => Math.max(max, sup.supplier_id), 0);
  const now = new Date();
  const newSupplier: Supplier = { ...s, supplier_id: maxId + 1, created_at: now };

  await db.put("suppliers", newSupplier);
  await enqueue({ table: "suppliers", operation: "create", recordId: newSupplier.supplier_id, data: s });
  return newSupplier;
};

const updateSupplier = async (id: number, s: Partial<SupplierCreate>): Promise<Supplier> => {
  const db = await getDB();
  const existing = await db.get("suppliers", id);
  if (!existing) throw new Error("Proveedor no encontrado");

  const updated: Supplier = { ...existing, ...s };
  await db.put("suppliers", updated);
  await enqueue({ table: "suppliers", operation: "update", recordId: id, data: s });
  return updated;
};

const deleteSupplier = async (id: number): Promise<void> => {
  const db = await getDB();
  await db.delete("suppliers", id);
  await enqueue({ table: "suppliers", operation: "delete", recordId: id, data: null });
};

// ─── SYNC QUEUE ──────────────────────────────────────────

const getPendingEntries = async (): Promise<SyncQueueEntry[]> => {
  const db = await getDB();
  const all = await db.getAll("syncQueue");
  return all.filter((e) => !e.synced).sort((a, b) => a.timestamp - b.timestamp);
};

const markSynced = async (id: string): Promise<void> => {
  const db = await getDB();
  const entry = await db.get("syncQueue", id);
  if (entry) {
    entry.synced = true;
    await db.put("syncQueue", entry);
  }
};

const clearSyncedEntries = async (): Promise<void> => {
  const db = await getDB();
  const all = await db.getAll("syncQueue");
  const synced = all.filter((e) => e.synced);
  const tx = db.transaction("syncQueue", "readwrite");
  for (const entry of synced) {
    await tx.store.delete(entry.id);
  }
  await tx.done;
};

// ─── AUTH ────────────────────────────────────────────────

const saveAuth = async (user: unknown): Promise<void> => {
  const db = await getDB();
  await db.put("auth", { key: "session", user });
};

const getAuth = async (): Promise<unknown | null> => {
  const db = await getDB();
  const entry = await db.get("auth", "session");
  return entry?.user ?? null;
};

const clearAuth = async (): Promise<void> => {
  const db = await getDB();
  await db.delete("auth", "session");
};

export const offlineService = {
  products: { get: getProducts, save: saveProducts, create: createProduct, update: updateProduct, remove: deleteProduct },
  sales: { get: getSales, save: saveSales, create: createSale },
  suppliers: { get: getSuppliers, save: saveSuppliers, create: createSupplier, update: updateSupplier, remove: deleteSupplier },
  sync: { getPending: getPendingEntries, markSynced, clearSynced: clearSyncedEntries },
  auth: { save: saveAuth, get: getAuth, clear: clearAuth },
};
