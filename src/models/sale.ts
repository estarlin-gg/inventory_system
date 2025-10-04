import { z } from "zod";
import { productSchema } from "./product";

export const salesProductSchema = productSchema.extend({
  quantity: z.number().int().positive("La cantidad debe ser mayor que 0"),
});

export const saleProductDtoSchema = z.object({
  product_id: z.number().int().positive(),
  product_name: z.string().min(1, "El nombre del producto es obligatorio"),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
});

export const saleSchema = z.object({
  id: z.number().int().positive().optional(),
  customer_name: z.string().min(1, "El nombre del cliente es obligatorio"),
  total_pay: z.number().nonnegative(),
  created_at: z.coerce.date(),
  sale_products: z.array(salesProductSchema),
});

export const saleDtoSchema = z.object({
  customer_name: z.string().min(1),
  // created_at: z.coerce.date(),
  totalPay: z.number().nonnegative(),
  sales_products: z.array(saleProductDtoSchema),
});

export const saleDetailSchema = z.object({
  id: z.number().int().positive(),
});

export type Sale = z.infer<typeof saleSchema>;
export type SalesProduct = z.infer<typeof salesProductSchema>;
export type SaleProductDto = z.infer<typeof saleProductDtoSchema>;
export type SaleDto = z.infer<typeof saleDtoSchema>;
export type SaleDetail = z.infer<typeof saleDetailSchema>;
