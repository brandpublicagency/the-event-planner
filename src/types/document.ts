
import { Json } from "@/integrations/supabase/types/base";

export interface Document {
  id: string;
  title: string;
  content: Json | DocumentContent;
  user_id: string;
  template: boolean | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  category_ids?: string[]; // Use this field for category IDs
}

export interface DocumentContent {
  type: "doc";
  html: string;
  text: string;
}

export function isDocumentContent(content: Json | DocumentContent): content is DocumentContent {
  return (
    typeof content === 'object' &&
    content !== null &&
    'type' in content &&
    content.type === 'doc' &&
    'html' in content &&
    'text' in content
  );
}
