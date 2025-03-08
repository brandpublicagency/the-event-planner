
import { supabase } from "@/integrations/supabase/client";

// API function to fetch link preview
export const fetchLinkPreview = async (url: string) => {
  try {
    console.log('Fetching link preview for:', url);
    const { data, error } = await supabase.functions.invoke('fetch-link-preview', {
      body: { url }
    });

    if (error) {
      console.error('Error fetching link preview:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in fetchLinkPreview:', error);
    throw error;
  }
};

// Document categories API functions
export const fetchCategories = async () => {
  try {
    console.log('Fetching categories');
    const { data, error } = await supabase
      .from('document_categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
    
    // Log the fetched categories to help debug
    console.log('Categories fetched:', data);
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getDocumentCategories = async (documentId: string) => {
  try {
    const { data, error } = await supabase
      .from('document_category_mappings')
      .select(`
        category_id,
        document_categories (
          id,
          name,
          color
        )
      `)
      .eq('document_id', documentId);
    
    if (error) throw error;
    return data.map(item => item.document_categories);
  } catch (error) {
    console.error('Error fetching document categories:', error);
    throw error;
  }
};

export const updateDocumentCategories = async (documentId: string, categoryIds: string[]) => {
  try {
    console.log('Updating document categories:', documentId, categoryIds);
    
    // First delete all existing mappings for this document
    const { error: deleteError } = await supabase
      .from('document_category_mappings')
      .delete()
      .eq('document_id', documentId);
    
    if (deleteError) throw deleteError;
    
    // Then insert new mappings if there are any categories
    if (categoryIds.length > 0) {
      const mappings = categoryIds.map(categoryId => ({
        document_id: documentId,
        category_id: categoryId
      }));
      
      const { error: insertError } = await supabase
        .from('document_category_mappings')
        .insert(mappings);
      
      if (insertError) throw insertError;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating document categories:', error);
    throw error;
  }
};

// Helper function to add the predefined categories
export const insertPredefinedCategories = async () => {
  try {
    const categories = [
      { name: 'Weddings & Events', color: '#F97316' },
      { name: 'Marketing & Advertising', color: '#8B5CF6' },
      { name: 'Event Menus', color: '#10B981' },
      { name: 'Staff', color: '#EC4899' },
      { name: 'Finances', color: '#EF4444' },
      { name: 'Admin', color: '#6366F1' }
    ];
    
    const { data, error } = await supabase
      .from('document_categories')
      .upsert(
        categories.map(cat => ({
          name: cat.name,
          color: cat.color
        })),
        { onConflict: 'name' }
      );
    
    if (error) throw error;
    console.log('Predefined categories added:', data);
    return data;
  } catch (error) {
    console.error('Error inserting predefined categories:', error);
    throw error;
  }
};
