
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface MenuOption {
  id: string;
  value: string;
  label: string;
  category: string;
}

export const useMenuOptions = (category: string) => {
  const [options, setOptions] = useState<MenuOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMenuOptions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('menu_options')
          .select('*')
          .eq('category', category);
          
        if (error) {
          throw new Error(error.message);
        }
        
        // Transform to MenuOption format
        const transformedData = data.map(item => ({
          id: item.id,
          value: item.name,
          label: item.name,
          category: item.category
        }));
        
        setOptions(transformedData);
      } catch (err: any) {
        console.error('Error fetching menu options:', err);
        setError(err.message);
        toast({
          title: 'Error',
          description: 'Failed to load menu options',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMenuOptions();
  }, [category, toast]);
  
  const saveMenuOptions = async (updatedOptions: MenuOption[]) => {
    try {
      // This would need to be implemented with proper upsert/delete operations
      // Just a placeholder for now
      console.log('Saving menu options:', updatedOptions);
      
      // Here you would actually save to Supabase
      // For now, we'll just update the local state
      setOptions(updatedOptions);
      
      return true;
    } catch (err: any) {
      console.error('Error saving menu options:', err);
      toast({
        title: 'Error',
        description: 'Failed to save menu options',
        variant: 'destructive'
      });
      throw err;
    }
  };
  
  return {
    options,
    isLoading,
    error,
    saveMenuOptions
  };
};
