
import { useState, useCallback, useEffect } from 'react';
import { 
  fetchMenuSections, 
  createMenuSection,
  updateMenuSection,
  deleteMenuSection,
  MenuSection,
  MenuSectionFormData
} from '@/api/menuItemsApi';
import { toast } from 'sonner';

export const useMenuSections = () => {
  const [sections, setSections] = useState<MenuSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<MenuSection | null>(null);
  
  // State for tracking async operations
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const fetchSections = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchMenuSections();
      setSections(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching menu sections:', err);
      setError(err);
      toast.error('Failed to load menu sections');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchSections();
  }, [fetchSections]);
  
  const handleAddSection = useCallback(async (data: MenuSectionFormData) => {
    setIsCreating(true);
    try {
      // Add display_order if not provided
      if (data.display_order === undefined) {
        data.display_order = sections.length;
      }
      
      const newSection = await createMenuSection(data);
      setSections(prev => [...prev, newSection]);
      setIsAddDialogOpen(false);
      toast.success('Section added successfully');
    } catch (err: any) {
      console.error('Error adding section:', err);
      toast.error('Failed to add section');
    } finally {
      setIsCreating(false);
    }
  }, [sections]);
  
  const handleUpdateSection = useCallback(async (id: string, data: Partial<MenuSectionFormData>) => {
    setIsUpdating(true);
    try {
      const updatedSection = await updateMenuSection(id, data);
      setSections(prev => prev.map(section => 
        section.id === id ? updatedSection : section
      ));
      setEditingSection(null);
      toast.success('Section updated successfully');
    } catch (err: any) {
      console.error('Error updating section:', err);
      toast.error('Failed to update section');
    } finally {
      setIsUpdating(false);
    }
  }, []);
  
  const handleDeleteSection = useCallback(async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteMenuSection(id);
      setSections(prev => prev.filter(section => section.id !== id));
      toast.success('Section deleted successfully');
    } catch (err: any) {
      console.error('Error deleting section:', err);
      toast.error('Failed to delete section');
    } finally {
      setIsDeleting(false);
    }
  }, []);
  
  // Function to manually refresh sections
  const refetch = useCallback(() => {
    return fetchSections();
  }, [fetchSections]);

  return {
    sections,
    isLoading,
    error,
    handleAddSection,
    handleUpdateSection,
    handleDeleteSection,
    isAddDialogOpen,
    setIsAddDialogOpen,
    editingSection,
    setEditingSection,
    isCreating,
    isUpdating,
    isDeleting,
    refetch
  };
};
