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
});

export const productSchema = productCreateSchema.extend({
  product_id: z.number().int().positive(),
  user_id: z.string().uuid().optional(),
  final_price: z.number().nonnegative(),
});

export type Product = z.infer<typeof productSchema>;
export type ProductCreate = z.infer<typeof productCreateSchema>;
