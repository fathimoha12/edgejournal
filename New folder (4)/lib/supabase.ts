import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getSupabaseBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  if (!supabaseUrl.startsWith("https://") || !supabaseUrl.includes(".supabase.co")) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL sax ma aha. Waa inuu u ekaadaa https://project-ref.supabase.co.");
  }

  if (!supabaseAnonKey.startsWith("ey") && !supabaseAnonKey.startsWith("sb_publishable_")) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY sax ma aha. Copy garee anon public ama publishable key-ga Supabase Project Settings > API.");
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}
