import { supabase } from "../lib/supabase";
import { Credentials, LoginCredentials } from "../models/auth";

export const login = async (c: LoginCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: c.email,
    password: c.password,
  });
  if (error) throw error;
  return data;
};

export const register = async (c: Credentials) => {
  // const { data, error } = await supabase.auth.signUp({
  //   email: c.email,
  //   password: c.password,
  // });
  const res = await supabase.auth.signUp({
    email: c.email,
    password: c.password,
  });
  
  return res;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
