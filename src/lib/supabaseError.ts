/* eslint-disable @typescript-eslint/no-explicit-any */

export const supabaseError = (error: any): string => {
  const code = error?.code;
  const message = error?.message;

  switch (code) {
    case "invalid_credentials":
      return "Credenciales inválidas. Verifica tu correo y contraseña.";

    case "user_already_exists":
    case "email_exists":
      return "Este correo ya está registrado.";

    case "email_not_confirmed":
      return "Debes confirmar tu correo antes de iniciar sesión.";

    case "user_not_found":
      return "Usuario no encontrado.";

    case "rate_limit_exceeded":
      return "Demasiados intentos. Intenta más tarde.";

    case "over_request_limit":
      return "Demasiadas solicitudes. Intenta más tarde.";

    default:
      return message || "Ha ocurrido un error.";
  }
};
