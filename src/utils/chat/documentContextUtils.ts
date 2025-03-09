
import { format } from "date-fns";

/**
 * Prepares documents context data for the AI assistant
 */
export function prepareDocumentsContext(documents: any[]) {
  if (!documents || documents.length === 0) {
    return "No documents found.";
  }
  
  return documents.map(doc => {
    return `Document: ${JSON.stringify({
      id: doc.id,
      title: doc.title || 'Untitled',
      created_at: doc.created_at ? format(new Date(doc.created_at), 'dd/MM/yyyy') : 'Unknown date',
      updated_at: doc.updated_at ? format(new Date(doc.updated_at), 'dd/MM/yyyy') : 'Unknown date',
      categories: doc.document_categories ? 
        doc.document_categories.map((cat: any) => cat.name).join(', ') : 
        'No categories'
    }, null, 2)}`;
  }).join('\n\n');
}
