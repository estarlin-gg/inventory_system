import { supabase } from "../supabase/supabase";
import { IUserCredentials } from "../model";
import { Session } from "@supabase/supabase-js";

export const registerUser = async (data: IUserCredentials): Promise<Session | null> => {
  const { data: { session }, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (error) {
    throw error;
  }

  return session; 
};

export const loginUser = async (data: IUserCredentials): Promise<Session | null> => {
  const { data: { session }, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    throw error;
  }

  return session; 
};

export const logoutUser = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};
