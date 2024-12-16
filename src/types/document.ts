import { Json } from "@/integrations/supabase/types/json";

export interface Document {
  id: string;
  title: string;
  content: Json | DocumentContent;
  user_id: string;
  template: boolean | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface DocumentContent {
  type: "doc";
  html: string;
  text: string;
}