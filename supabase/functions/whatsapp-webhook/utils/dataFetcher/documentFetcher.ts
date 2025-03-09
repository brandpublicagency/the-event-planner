
import { supabase, handleDbError } from './index.ts';
import { withTimeout } from '../timeoutUtils.ts';

export const fetchDocuments = async () => {
  console.log('Fetching documents data');
  
  try {
    const { data: documents, error } = await withTimeout(
      supabase
        .from('documents')
        .select('*')
        .is('deleted_at', null),
      'fetchDocuments',
      10000
    );
    
    if (error) {
      handleDbError('fetchDocuments', error);
    }
    
    console.log(`Successfully fetched ${documents?.length || 0} documents`);
    return documents || [];
  } catch (error) {
    console.error('Error in fetchDocuments:', error);
    return [];
  }
};
