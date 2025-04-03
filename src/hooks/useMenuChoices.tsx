
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  fetchMenuChoices,
  fetchMenuChoicesBySection,
  createMenuChoice, 
  updateMenuChoice, 
  deleteMenuChoice,
  MenuChoice,
  MenuChoiceFormData
} from '@/api/menuItemsApi';

export const useMenuChoices = (sectionId?: string) => {
  const queryClient = useQueryClient();
  const [editingChoice, setEditingChoice] = useState<MenuChoice | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const queryKey = sectionId 
    ? ['menuChoices', sectionId] 
    : ['menuChoices'];

  const queryFn = sectionId 
    ? () => fetchMenuChoicesBySection(sectionId)
    : fetchMenuChoices;

  const { 
    data: choices = [], 
    isLoading,
    error 
  } = useQuery({
    queryKey,
    queryFn,
    enabled: sectionId ? !!sectionId : true
  });

  const createMutation = useMutation({
    mutationFn: createMenuChoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      // Also invalidate menu items as they depend on choices
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      toast.success('Menu choice created successfully');
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to create menu choice: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MenuChoiceFormData> }) => 
      updateMenuChoice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      // Also invalidate menu items as they depend on choices
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      toast.success('Menu choice updated successfully');
      setEditingChoice(null);
    },
    onError: (error) => {
      toast.error(`Failed to update menu choice: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMenuChoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      // Also invalidate menu items as they depend on choices
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      toast.success('Menu choice deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete menu choice: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const handleAddChoice = (data: MenuChoiceFormData) => {
    createMutation.mutate(data);
  };

  const handleUpdateChoice = (id: string, data: Partial<MenuChoiceFormData>) => {
    updateMutation.mutate({ id, data });
  };

  const handleDeleteChoice = (id: string) => {
    deleteMutation.mutate(id);
  };

  return {
    choices,
    isLoading,
    error,
    handleAddChoice,
    handleUpdateChoice,
    handleDeleteChoice,
    editingChoice,
    setEditingChoice,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};
