import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
export const BUCKET = "knowledge-files";
export type Role = { id: string; slug: string; name: string; description: string; handover_message: string | null; handover_author: string | null; sort_order: number };
export type Cycle = { id: string; role_id: string; name: string; officer_name: string | null; officer_phone: string | null };
export type FileRow = { id: string; cycle_id: string; role_id: string; category: "format" | "handover"; title: string; uploader_name: string; file_name: string; file_size: number | null; mime_type: string | null; storage_path: string; public_url: string | null; created_at: string };
