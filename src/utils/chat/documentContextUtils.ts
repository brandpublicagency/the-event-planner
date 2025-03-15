
/**
 * Prepares documents context for AI
 */
export const prepareDocumentsContext = (documents: any[] = []): string => {
  if (!documents || documents.length === 0) {
    return 'No documents found.';
  }
  
  // Sort documents by most recently updated
  const sortedDocuments = [...documents].sort((a, b) => {
    if (!a.updated_at) return 1;
    if (!b.updated_at) return -1;
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });
  
  let documentsContext = `DOCUMENTS (${documents.length} total):\n`;
  
  // Group documents by category if available
  const documentsByCategory: Record<string, any[]> = {};
  let uncategorized: any[] = [];
  
  sortedDocuments.forEach(doc => {
    if (doc.category) {
      if (!documentsByCategory[doc.category]) {
        documentsByCategory[doc.category] = [];
      }
      documentsByCategory[doc.category].push(doc);
    } else {
      uncategorized.push(doc);
    }
  });
  
  // Add category-based document lists
  Object.entries(documentsByCategory).forEach(([category, docs]) => {
    documentsContext += `\n${category.toUpperCase()} (${docs.length}):\n`;
    docs.slice(0, 5).forEach((doc, index) => {
      documentsContext += `${index + 1}. ${doc.title || 'Untitled'} - Last updated: ${new Date(doc.updated_at).toLocaleDateString()}\n`;
    });
    
    if (docs.length > 5) {
      documentsContext += `... and ${docs.length - 5} more ${category} documents.\n`;
    }
  });
  
  // Add uncategorized documents
  if (uncategorized.length > 0) {
    documentsContext += `\nOTHER DOCUMENTS (${uncategorized.length}):\n`;
    uncategorized.slice(0, 5).forEach((doc, index) => {
      documentsContext += `${index + 1}. ${doc.title || 'Untitled'} - Last updated: ${new Date(doc.updated_at).toLocaleDateString()}\n`;
    });
    
    if (uncategorized.length > 5) {
      documentsContext += `... and ${uncategorized.length - 5} more uncategorized documents.\n`;
    }
  }
  
  return documentsContext;
};
