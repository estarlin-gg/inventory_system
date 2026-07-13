import { z } from "zod";

export const productCreateSchema = z.object({
  
  product_name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().optional(),
  price: z.number().nonnegative({ message: "El precio no puede ser negativo" }),
  cost: z
    .number()
    .nonnegative({ message: "El costo no puede ser negativo" }),
  stock: z
    .number()
    .int()
    .nonnegative({ message: "El stock no puede ser negativo" }),
  discount: z.number().min(0).max(100).optional(),
  supplier_id: z.number().int().positive().nullable().optional(),
});

export const productSchema = productCreateSchema.extend({
  product_id: z.number().int().positive(),
  final_price: z.number().nonnegative(),
});



export type Product = z.infer<typeof productSchema>;
export type ProductCreate = z.infer<typeof productCreateSchema>;

