
export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface DocumentCategoryMapping {
  document_id: string;
  category_id: string;
  created_at: string;
}
