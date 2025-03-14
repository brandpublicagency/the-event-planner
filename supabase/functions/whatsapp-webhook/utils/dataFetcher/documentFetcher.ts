
import { supabase, handleDbError } from './index.ts';
import { withTimeout } from '../timeoutUtils.ts';

export const fetchDocuments = async () => {
  console.log('Fetching documents data from database');
  
  try {
    const { data: documents, error } = await withTimeout(
      supabase
        .from('documents')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false }),
      'fetchDocuments',
      10000
    );
    
    if (error) {
      handleDbError('fetchDocuments', error);
      return [];
    }
    
    console.log(`Successfully fetched ${documents?.length || 0} documents`);
    return documents || [];
  } catch (error) {
    console.error('Error in fetchDocuments:', error);
    return [];
  }
};

// Add a document search function to improve document discoverability via WhatsApp
export const searchDocuments = async (searchTerm: string) => {
  console.log(`Searching for documents matching: "${searchTerm}"`);
  
  try {
    // Search in title and content if the search term is provided
    if (searchTerm && searchTerm.trim()) {
      const trimmedSearch = searchTerm.trim().toLowerCase();
      
      const { data: documents, error } = await withTimeout(
        supabase
          .from('documents')
          .select('*')
          .is('deleted_at', null)
          .or(`title.ilike.%${trimmedSearch}%,content.ilike.%${trimmedSearch}%`)
          .order('created_at', { ascending: false })
          .limit(5),
        'searchDocuments',
        10000
      );
      
      if (error) {
        handleDbError('searchDocuments', error);
        return [];
      }
      
      console.log(`Found ${documents?.length || 0} documents matching "${searchTerm}"`);
      return documents || [];
    } else {
      // If no search term provided, return latest documents
      return await fetchDocuments();
    }
  } catch (error) {
    console.error('Error in searchDocuments:', error);
    return [];
  }
};
