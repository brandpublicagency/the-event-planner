import { Json } from "@/integrations/supabase/types/json";

export interface Document {
  id: string;
  title: string;
  content: Json | null;
  user_id: string;
  template: boolean | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface DocumentContent {
  html: string;
  text: string;
}