import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export type OrderInput = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  customer_name: string;
  email: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  items: { slug: string; name: string; qty: number; price: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  notes?: string;
};