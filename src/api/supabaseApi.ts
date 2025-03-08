
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
    // Get the document with its category_ids
    const { data: document, error: documentError } = await supabase
      .from('documents')
      .select('category_ids')
      .eq('id', documentId)
      .maybeSingle();
    
    if (documentError) throw documentError;
    
    const categoryIds = document?.category_ids || [];
    
    if (categoryIds.length === 0) {
      return [];
    }
    
    // Fetch the actual category objects
    const { data: categories, error: categoriesError } = await supabase
      .from('document_categories')
      .select('*')
      .in('id', categoryIds);
    
    if (categoriesError) throw categoriesError;
    
    return categories || [];
  } catch (error) {
    console.error('Error fetching document categories:', error);
    throw error;
  }
};

export const updateDocumentCategories = async (documentId: string, categoryIds: string[]) => {
  try {
    console.log('Updating document categories:', documentId, categoryIds);
    
    // Update the document with the category IDs
    const { error: updateError } = await supabase
      .from('documents')
      .update({ category_ids: categoryIds })
      .eq('id', documentId);
    
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error updating document categories:', error);
    throw error;
  }
};

// Helper function to add the predefined categories
export const insertPredefinedCategories = async () => {
  try {
    // Check if user is authenticated first
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      console.log('User not authenticated, skipping category creation');
      return [];
    }

    const userId = session.session.user.id;
    console.log('Creating categories for user:', userId);
    
    const categories = [
      { name: 'Weddings & Events', color: '#F97316', user_id: userId },
      { name: 'Marketing & Advertising', color: '#8B5CF6', user_id: userId },
      { name: 'Event Menus', color: '#10B981', user_id: userId },
      { name: 'Staff', color: '#EC4899', user_id: userId },
      { name: 'Finances', color: '#EF4444', user_id: userId },
      { name: 'Admin', color: '#6366F1', user_id: userId }
    ];
    
    // First check if categories exist
    const { data: existingCategories, error: fetchError } = await supabase
      .from('document_categories')
      .select('name');
    
    if (fetchError) throw fetchError;
    
    // Only insert categories that don't exist yet
    const existingNames = existingCategories.map(cat => cat.name);
    const newCategories = categories.filter(cat => !existingNames.includes(cat.name));
    
    if (newCategories.length > 0) {
      const { data, error } = await supabase
        .from('document_categories')
        .insert(newCategories);
      
      if (error) throw error;
      console.log('Predefined categories added:', newCategories.length);
      return data;
    } else {
      console.log('All predefined categories already exist');
      return [];
    }
  } catch (error) {
    console.error('Error inserting predefined categories:', error);
    throw error;
  }
};
