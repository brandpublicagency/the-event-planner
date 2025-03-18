
export interface SearchResult {
  id: string; 
  title: string;
  path: string;
  type: 'event' | 'contact' | 'document' | 'task';
}
