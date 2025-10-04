// store/productSlice.ts
import { StateCreator } from "zustand";
import { Product } from "../models/product";

export interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  setProducts: (products: Product[]) => void;
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  removeProduct: (id: number) => void;
  setSelectedProduct: (p: Product | null) => void;
}

export const useProductSlice: StateCreator<ProductState> = (set) => ({
  products: [],
  selectedProduct: null,

  setProducts: (products) => set({ products: [...products] }),
  addProduct: (p) => set((state) => ({ products: [...state.products, p] })),
  updateProduct: (p) =>
    set((state) => ({
      products: state.products.map((prod) =>
        prod.product_id === p.product_id ? { ...p } : prod
      ),
    })),
  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((prod) => prod.product_id !== id),
    })),
  setSelectedProduct: (p) => set({ selectedProduct: p }),
});
