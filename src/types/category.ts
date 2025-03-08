
export interface Category {
  id: string;
  name: string;
  color: string | null;
  created_at: string;
  user_id?: string;
}

export interface DocumentCategoryMapping {
  document_id: string;
  category_id: string;
  created_at: string;
}
