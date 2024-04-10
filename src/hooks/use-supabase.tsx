import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default function useSupabase() {
  const cookieStore = cookies();
  return createClient(cookieStore);
}