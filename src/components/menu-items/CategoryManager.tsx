
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

interface Category {
  name: string;
  id: string;
}

interface CategoryManagerProps {
  choiceId?: string;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ choiceId }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [manualRefreshCounter, setManualRefreshCounter] = useState(0);
  
  const queryClient = useQueryClient();

  // Function to generate a unique query key every time
  const getUniqueQueryKey = useCallback(() => {
    return ['menu-categories-list', choiceId, Date.now(), manualRefreshCounter];
  }, [choiceId, manualRefreshCounter]);
  
  // Use unique query key to force refresh
  const categoryQueryKey = getUniqueQueryKey();
  
  const { data: categories = [], isLoading, error, refetch } = useQuery({
    queryKey: categoryQueryKey,
    queryFn: async () => {
      console.log(`CategoryManager: Fetching categories for choice: ${choiceId || 'all'} with key:`, categoryQueryKey);
      
      try {
        let query = supabase
          .from('menu_items')
          .select('category')
          .not('category', 'is', null);
        
        // If choiceId is provided, filter by that choice
        if (choiceId) {
          query = query.eq('choice_id', choiceId);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching categories:", error);
          toast.error("Failed to load categories");
          return [];
        }
        
        if (data) {
          // Extract unique categories and format them
          const uniqueCategories = [...new Set(data.map(item => item.category).filter(Boolean))];
          console.log(`CategoryManager: Found ${uniqueCategories.length} categories:`, uniqueCategories);
          return uniqueCategories.map(name => ({ 
            name, 
            id: name // Using the name as ID since categories don't have their own table
          }));
        }
        
        return [];
      } catch (err) {
        console.error("Unexpected error in fetchCategories:", err);
        toast.error("An unexpected error occurred while loading categories");
        return [];
      }
    },
    staleTime: 0, // Always fetch fresh data
    refetchInterval: false, // Managed by manual refreshes
    refetchOnWindowFocus: true, // Refetch when window gets focus
    refetchOnMount: true, // Refetch when component mounts
  });
  
  // Helper function to force refresh all category-related queries
  const refreshAllCategoryQueries = useCallback(() => {
    console.log("CategoryManager: Force refreshing all category queries");
    
    // Force a manual refresh by incrementing the counter
    setManualRefreshCounter(prev => prev + 1);
    
    // Invalidate with different patterns used across the app
    queryClient.invalidateQueries({ queryKey: ['menu-categories-list'] });
    queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
    queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    
    // Specific queries for this choice if available
    if (choiceId) {
      queryClient.invalidateQueries({ queryKey: ['menu-categories-list', choiceId] });
      queryClient.invalidateQueries({ queryKey: ['menu-categories', choiceId] });
      queryClient.invalidateQueries({ queryKey: ['menuItems', choiceId] });
    }
    
    // Immediately refetch
    setTimeout(() => {
      refetch();
    }, 100);
  }, [queryClient, choiceId, refetch]);
  
  // Mutation for adding a new category
  const addCategoryMutation = useMutation({
    mutationFn: async (name: string) => {
      console.log(`CategoryManager: Adding new category: ${name}`);
      
      // Since we don't have a dedicated categories table, we'll create a dummy item
      // with the new category to make it available in the system
      const { data, error } = await supabase
        .from('menu_items')
        .insert({
          label: `Placeholder for ${name}`,
          value: `placeholder-${name.toLowerCase().replace(/\s+/g, '-')}`,
          category: name,
          choice_id: choiceId || '00000000-0000-0000-0000-000000000000', // Use a fallback ID if none provided
          choice: 'placeholder'
        })
        .select();
      
      if (error) throw error;
      
      return { name, id: name };
    },
    onSuccess: (_, newCategoryName) => {
      toast.success('Category added successfully');
      console.log(`CategoryManager: Category "${newCategoryName}" added successfully`);
      
      // Force immediate refresh of all relevant queries
      refreshAllCategoryQueries();
      
      setIsAddDialogOpen(false);
      setNewCategoryName('');
    },
    onError: (error: any) => {
      toast.error(`Error adding category: ${error.message}`);
      console.error("CategoryManager: Error adding category:", error);
    }
  });
  
  // Mutation for editing a category
  const editCategoryMutation = useMutation({
    mutationFn: async ({ oldName, newName }: { oldName: string, newName: string }) => {
      console.log(`CategoryManager: Updating category from "${oldName}" to "${newName}"`);
      
      // First, check if any items exist with this category and choice_id
      let queryCheck = supabase
        .from('menu_items')
        .select('id')
        .eq('category', oldName);
      
      if (choiceId) {
        queryCheck = queryCheck.eq('choice_id', choiceId);
      }
      
      const { data: checkData, error: checkError } = await queryCheck;
      
      if (checkError) {
        throw checkError;
      }
      
      // If no items found, we can't update - the category doesn't exist for this choice
      if (!checkData || checkData.length === 0) {
        console.log(`No items found with category "${oldName}" for choice ${choiceId}`);
        throw new Error(`No items found with category "${oldName}"`);
      }
      
      // Now update all items with the matching category
      let query = supabase
        .from('menu_items')
        .update({ category: newName })
        .eq('category', oldName);
      
      // If choiceId is provided, only update items for that choice
      if (choiceId) {
        query = query.eq('choice_id', choiceId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      console.log(`CategoryManager: Updated items with new category name`);
      return { success: true, oldName, newName };
    },
    onSuccess: (result) => {
      if (result && result.oldName && result.newName) {
        toast.success(`Category "${result.oldName}" updated to "${result.newName}"`);
      } else {
        toast.success('Category updated successfully');
      }
      
      console.log("CategoryManager: Category updated successfully");
      
      // Force immediate refresh of all relevant queries
      refreshAllCategoryQueries();
      
      // Clear edit state
      setIsEditDialogOpen(false);
      setSelectedCategory(null);
      setEditCategoryName('');
    },
    onError: (error: any) => {
      toast.error(`Error updating category: ${error.message}`);
      console.error("CategoryManager: Error updating category:", error);
      
      // Keep dialog open in case of error so user can try again
      // But clear selection if it's a fatal error
      if (error.message.includes("No items found")) {
        setIsEditDialogOpen(false);
        setSelectedCategory(null);
        setEditCategoryName('');
        
        // Refresh to get latest state
        refreshAllCategoryQueries();
      }
    }
  });
  
  // Mutation for deleting a category
  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryName: string) => {
      console.log(`CategoryManager: Deleting category: ${categoryName}`);
      
      // First, check if any items exist with this category and choice_id
      let queryCheck = supabase
        .from('menu_items')
        .select('id')
        .eq('category', categoryName);
      
      if (choiceId) {
        queryCheck = queryCheck.eq('choice_id', choiceId);
      }
      
      const { data: checkData, error: checkError } = await queryCheck;
      
      if (checkError) {
        throw checkError;
      }
      
      // If no items found, we can't delete - the category doesn't exist for this choice
      if (!checkData || checkData.length === 0) {
        console.log(`No items found with category "${categoryName}" for choice ${choiceId}`);
        throw new Error(`No items found with category "${categoryName}"`);
      }
      
      // Now update all items with the matching category to remove the category
      let query = supabase
        .from('menu_items')
        .update({ category: null })
        .eq('category', categoryName);
      
      // If choiceId is provided, only update items for that choice
      if (choiceId) {
        query = query.eq('choice_id', choiceId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      console.log(`CategoryManager: Removed category from items`);
      return { success: true, categoryName };
    },
    onSuccess: (result) => {
      if (result && result.categoryName) {
        toast.success(`Category "${result.categoryName}" deleted successfully`);
      } else {
        toast.success('Category deleted successfully');
      }
      
      console.log("CategoryManager: Category deleted successfully");
      
      // Force immediate refresh of all relevant queries
      refreshAllCategoryQueries();
      
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
    },
    onError: (error: any) => {
      toast.error(`Error deleting category: ${error.message}`);
      console.error("CategoryManager: Error deleting category:", error);
      
      // Keep dialog open in case of error so user can try again
      // But clear selection if it's a fatal error
      if (error.message.includes("No items found")) {
        setIsDeleteDialogOpen(false);
        setSelectedCategory(null);
        
        // Refresh to get latest state
        refreshAllCategoryQueries();
      }
    }
  });
  
  // Force refetch when component mounts and periodically
  useEffect(() => {
    console.log("CategoryManager: Initial load - forcing refetch");
    refreshAllCategoryQueries();
    
    // Set up periodic refresh
    const intervalId = setInterval(() => {
      console.log("CategoryManager: Periodic refresh");
      refreshAllCategoryQueries();
    }, 3000); // Refresh every 3 seconds
    
    return () => clearInterval(intervalId);
  }, [refreshAllCategoryQueries]);
  
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }
    addCategoryMutation.mutate(newCategoryName.trim());
  };
  
  const handleEditCategory = () => {
    if (!editCategoryName.trim() || !selectedCategory) {
      toast.error('Category name cannot be empty');
      return;
    }
    
    // Check if name hasn't changed
    if (editCategoryName.trim() === selectedCategory.name) {
      toast.info('Category name was not changed');
      setIsEditDialogOpen(false);
      return;
    }
    
    editCategoryMutation.mutate({ 
      oldName: selectedCategory.name, 
      newName: editCategoryName.trim() 
    });
  };
  
  const handleDeleteCategory = () => {
    if (!selectedCategory) {
      toast.error('No category selected for deletion');
      return;
    }
    deleteCategoryMutation.mutate(selectedCategory.name);
  };
  
  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setEditCategoryName(category.name);
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  // Main content renderer with improved loading state
  const renderContent = () => {
    // Show loading state
    if (isLoading || !categories) {
      return (
        <div className="flex flex-col justify-center items-center py-10">
          <Spinner className="h-12 w-12 text-primary mb-4" />
          <span className="text-sm text-muted-foreground">Loading categories...</span>
        </div>
      );
    }

    // Show empty state
    if (categories.length === 0) {
      return (
        <div className="text-center py-8 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">
            No categories found. Add your first category to organize menu items.
          </p>
          <Button 
            onClick={() => setIsAddDialogOpen(true)} 
            variant="outline" 
            size="sm" 
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Category
          </Button>
        </div>
      );
    }

    // Show categories list
    return (
      <div className="grid gap-2">
        {categories.map((category) => (
          <div 
            key={category.id}
            className="flex justify-between items-center p-3 border rounded-md bg-white hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium">{category.name}</span>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => openEditDialog(category)}
                className="h-9 px-2.5"
                disabled={editCategoryMutation.isPending || deleteCategoryMutation.isPending}
              >
                {editCategoryMutation.isPending && selectedCategory?.id === category.id ? (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                ) : (
                  <Edit className="h-4 w-4 text-blue-500" />
                )}
                <span className="sr-only">Edit</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => openDeleteDialog(category)}
                className="h-9 px-2.5"
                disabled={editCategoryMutation.isPending || deleteCategoryMutation.isPending}
              >
                {deleteCategoryMutation.isPending && selectedCategory?.id === category.id ? (
                  <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                ) : (
                  <Trash2 className="h-4 w-4 text-red-500" />
                )}
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Show error state if there was an error fetching categories
  if (error) {
    console.error("Error fetching categories:", error);
    return (
      <div className="text-center py-8 border rounded-md bg-red-50">
        <p className="text-red-500">
          Failed to load categories. Please try again.
        </p>
        <Button 
          onClick={refreshAllCategoryQueries} 
          variant="outline" 
          size="sm" 
          className="mt-2"
        >
          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Menu Categories</h3>
        <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Category
        </Button>
      </div>
      
      {renderContent()}
      
      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
              disabled={addCategoryMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddCategory}
              disabled={addCategoryMutation.isPending || !newCategoryName.trim()}
            >
              {addCategoryMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : 'Add Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        if (!editCategoryMutation.isPending) {
          setIsEditDialogOpen(open);
          if (!open) {
            setSelectedCategory(null);
            setEditCategoryName('');
          }
        }
      }}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Category name"
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              disabled={editCategoryMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditCategory}
              disabled={editCategoryMutation.isPending || !editCategoryName.trim()}
            >
              {editCategoryMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : 'Update Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Category Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={(open) => {
        if (!deleteCategoryMutation.isPending) {
          setIsDeleteDialogOpen(open);
          if (!open) {
            setSelectedCategory(null);
          }
        }
      }}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the category "{selectedCategory?.name}" from all menu items.
              The menu items themselves will not be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteCategoryMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault(); // Prevent the dialog from closing automatically
                handleDeleteCategory();
              }}
              disabled={deleteCategoryMutation.isPending}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteCategoryMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoryManager;
