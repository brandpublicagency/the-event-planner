export interface Document {
  id: string;
  title: string;
  content?: {
    html: string;
    text: string;
  };
  user_id: string;
  template?: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}