
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  fetchMenuSections, 
  createMenuSection, 
  updateMenuSection, 
  deleteMenuSection,
  MenuSection,
  MenuSectionFormData
} from '@/api/menuItemsApi';

export const useMenuSections = () => {
  const queryClient = useQueryClient();
  const [editingSection, setEditingSection] = useState<MenuSection | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { 
    data: sections = [], 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['menuSections'],
    queryFn: fetchMenuSections,
  });

  const createMutation = useMutation({
    mutationFn: createMenuSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuSections'] });
      // Also invalidate menu items as they depend on sections
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      toast.success('Menu section created successfully');
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to create menu section: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MenuSectionFormData> }) => 
      updateMenuSection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuSections'] });
      // Also invalidate menu items as they depend on sections
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      toast.success('Menu section updated successfully');
      setEditingSection(null);
    },
    onError: (error) => {
      toast.error(`Failed to update menu section: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMenuSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuSections'] });
      // Also invalidate menu items as they depend on sections
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      toast.success('Menu section deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete menu section: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const handleAddSection = (data: MenuSectionFormData) => {
    createMutation.mutate(data);
  };

  const handleUpdateSection = (id: string, data: Partial<MenuSectionFormData>) => {
    updateMutation.mutate({ id, data });
  };

  const handleDeleteSection = (id: string) => {
    deleteMutation.mutate(id);
  };

  return {
    sections,
    isLoading,
    error,
    handleAddSection,
    handleUpdateSection,
    handleDeleteSection,
    editingSection,
    setEditingSection,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};
