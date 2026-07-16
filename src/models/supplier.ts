import { z } from "zod";

export const supplierCreateSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  phone: z.string().optional(),
  email: z.string().email("El email no es válido").optional().or(z.literal("")),
  address: z.string().optional(),
});

export const supplierSchema = supplierCreateSchema.extend({
  supplier_id: z.number().int().positive(),
  user_id: z.string().uuid().optional(),
  created_at: z.coerce.date(),
});

export type Supplier = z.infer<typeof supplierSchema>;
export type SupplierCreate = z.infer<typeof supplierCreateSchema>;
