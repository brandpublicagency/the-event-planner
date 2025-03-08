
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
    const { data, error } = await supabase
      .from('document_categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const createCategory = async (name: string, color?: string) => {
  try {
    // Get the current user's ID
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('document_categories')
      .insert({ 
        name, 
        color,
        user_id: session.user.id
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (id: string, updates: { name?: string, color?: string }) => {
  try {
    const { data, error } = await supabase
      .from('document_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const { error } = await supabase
      .from('document_categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
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
