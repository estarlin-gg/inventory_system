import { User } from "@supabase/supabase-js";

export interface IAuthContext {
  credentials: User | null;
  loading: boolean;
}

export interface IUserCredentials {
  email: string;
  password: string;
}

export interface IProduct {
  id: string;
  user_id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stocks: number;
}

export interface IOrderItem extends IProduct {
  quantity: number;
}

export interface IInvoice {
  id?: string;
  items: IOrderItem[];
  client: string;
  invoice_id: string;
  invoice_url: string;
  total: number;
  user_id?: string;
}
