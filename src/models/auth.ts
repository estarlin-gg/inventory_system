import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().email("El email no es válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  userName: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
});

export const loginCredentialsSchema = z.object({
  email: z.string().email("El email no es válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});



export type Credentials = z.infer<typeof credentialsSchema>;
export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;

