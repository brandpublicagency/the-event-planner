
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
        
        console.log(`Fetching menu options for category: ${category}`);
        
        const { data, error } = await supabase
          .from('menu_options')
          .select('*')
          .eq('category', category)
          .order('name');
          
        if (error) {
          throw new Error(error.message);
        }
        
        console.log(`Retrieved ${data?.length || 0} options for ${category}:`, data);
        
        // Transform to MenuOption format
        const transformedData = data.map(item => ({
          id: item.id,
          value: item.type,
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
      setIsLoading(true);
      console.log('Saving menu options:', updatedOptions);
      return true;
    } catch (err: any) {
      console.error('Error saving menu options:', err);
      toast({
        title: 'Error',
        description: 'Failed to save menu options',
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    options,
    isLoading,
    error,
    saveMenuOptions
  };
};
