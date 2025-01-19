import { StateCreator } from "zustand";
import { IProduct } from "../model";
import {
  createProduct,
  getProducts as fetchProducts,
  updateProduct,
} from "../services/productService";
import { uploadImage } from "../services/fileServices";
import { ChangeEvent } from "react";

export interface ProductState {
  products: IProduct[];
  selectedProduct: IProduct;
  productFile: File | null;
  getProducts: (uid: string) => Promise<void>;
  createProduct: (product: IProduct, user_id: string) => Promise<void>;
  updateProduct: (product: IProduct) => Promise<void>;
  handleSelectProduct: (p: IProduct) => void;
  handleFile: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const productSlice: StateCreator<ProductState> = (set, get) => ({
  products: [],
  productFile: null,
  selectedProduct: {} as IProduct,
  getProducts: async (uid) => {
    try {
      const products = await fetchProducts(uid);
      set(() => ({ products: products || [] }));
    } catch (error) {
      console.error("Error al obtener productos:", error);
      set(() => ({ products: [] }));
    }
  },
  createProduct: async (product, user_id) => {
    try {
      const imgUrl = await uploadImage(user_id, get().productFile);
      const newProduct = { ...product, image: imgUrl };
      await createProduct(newProduct);
      set((state) => ({
        products: [...state.products, newProduct],
      }));
    } catch (error) {
      console.log(error);
    }
  },
  updateProduct: async (product) => {
    try {
      await updateProduct(product);
      set((state) => ({
        products: state.products.map((p) =>
          p.id === product.id ? { ...p, ...product } : p
        ),
      }));
    } catch (error) {
      console.log(error);
    }
  },

  handleSelectProduct: (p) => {
    set(() => ({ selectedProduct: p }));
  },
  handleFile: (e) => {
    set(() => ({
      productFile: e.target.files![0],
    }));
  },
});
