import { createClient } from '@supabase/supabase-js';
import type { AnalysisResult } from '@/numerology/analyzer';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type AnalysisRow = {
  id: string;
  user_id: string;
  mobile: string;
  dob: string | null;
  mobile_total: number;
  result: AnalysisResult;
  label: string | null;
  created_at: string;
};
