import { z } from "zod";

export const investmentCreateSchema = z.object({
  supplier_id: z.number().int().positive(),
  product_id: z.number().int().positive(),
  quantity: z.number().int().positive("La cantidad debe ser mayor que 0"),
  unit_cost: z.number().nonnegative("El costo no puede ser negativo"),
  note: z.string().optional(),
});

export const investmentSchema = investmentCreateSchema.extend({
  id: z.number().int().positive(),
  user_id: z.string().uuid(),
  total_cost: z.number(),
  product_name: z.string().optional(),
  created_at: z.coerce.date(),
});

export type Investment = z.infer<typeof investmentSchema>;
export type InvestmentCreate = z.infer<typeof investmentCreateSchema>;
