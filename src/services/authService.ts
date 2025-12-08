import { supabase } from "../lib/supabase";
import { Credentials, LoginCredentials } from "../models/auth";

// export const login = async (c: LoginCredentials) => {
//   const { data, error } = await supabase.auth.signInWithPassword({
//     email: c.email,
//     password: c.password,
//   });
//   if (error) throw error;

//   return data;
// };
export const login = async (c: LoginCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: c.email,
    password: c.password,
  });

  if (error) throw error;

  return data;
};

export const register = async (c: Credentials) => {
  const res = await supabase.auth.signUp({
    email: c.email,
    password: c.password,
    options: {
      data: {
        display_name: c.userName,
      },
    },
  });

  return res;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) throw error;
};
