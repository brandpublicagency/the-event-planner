
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
  
  const queryClient = useQueryClient();

  // Use timestamp in query key to force refresh every time component mounts
  const timestamp = Date.now();
  const categoryQueryKey = ['menu-categories-list', choiceId, timestamp];
  
  // Modified to fetch categories with timestamp in key
  const { data: categories = [], isLoading, refetch } = useQuery({
    queryKey: categoryQueryKey,
    queryFn: async () => {
      console.log(`CategoryManager: Fetching categories for choice: ${choiceId || 'all'} at timestamp ${timestamp}`);
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
    },
    staleTime: 0, // Always fetch fresh data
    refetchInterval: 1000, // Refetch every second
    refetchOnWindowFocus: true, // Refetch when window gets focus
    refetchOnMount: true, // Refetch when component mounts
  });
  
  // Helper function to force refresh all category-related queries
  const refreshAllCategoryQueries = useCallback(() => {
    console.log("CategoryManager: Force refreshing all category queries");
    
    // Invalidate with different patterns used across the app
    queryClient.invalidateQueries({ queryKey: ['menu-categories-list'] });
    queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
    queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    
    // Using timestamps to force refresh
    const refreshTimestamp = Date.now();
    queryClient.invalidateQueries({ 
      queryKey: ['menu-categories-list', refreshTimestamp] 
    });
    queryClient.invalidateQueries({ 
      queryKey: ['menu-categories', refreshTimestamp] 
    });
    
    // Specific queries for this choice if available
    if (choiceId) {
      queryClient.invalidateQueries({ queryKey: ['menu-categories-list', choiceId] });
      queryClient.invalidateQueries({ queryKey: ['menu-categories', choiceId] });
      queryClient.invalidateQueries({ queryKey: ['menuItems', choiceId] });
      
      // With timestamp
      queryClient.invalidateQueries({ 
        queryKey: ['menu-categories-list', choiceId, refreshTimestamp] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['menu-categories', choiceId, refreshTimestamp] 
      });
    }
    
    // Refetch current data
    refetch();
  }, [queryClient, choiceId, refetch]);
  
  // Mutation for adding a new category (actually updates menu items with new category)
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
          choice_id: choiceId,
          choice: 'placeholder'
        })
        .select();
      
      if (error) throw error;
      
      // Check if data is array before accessing it
      const updatedCount = data ? (Array.isArray(data) ? data.length : 0) : 0;
      console.log(`CategoryManager: Added placeholder item with category "${name}":`, updatedCount > 0 ? data : 'No data returned');
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
  
  // Mutation for editing a category (updates all menu items with the old category)
  const editCategoryMutation = useMutation({
    mutationFn: async ({ oldName, newName }: { oldName: string, newName: string }) => {
      console.log(`CategoryManager: Updating category from "${oldName}" to "${newName}"`);
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
      
      // Define the correct type for data to avoid "never" type issue
      type QueryResponse = any[] | null;
      const responseData = data as QueryResponse;
      
      // Now safely access length with proper type checking
      const updatedCount = responseData ? responseData.length : 0;
      console.log(`CategoryManager: Updated ${updatedCount} items with new category name`);
      return { success: true };
    },
    onSuccess: () => {
      toast.success('Category updated successfully');
      console.log("CategoryManager: Category updated successfully");
      
      // Force immediate refresh of all relevant queries
      refreshAllCategoryQueries();
      
      setIsEditDialogOpen(false);
      setSelectedCategory(null);
      setEditCategoryName('');
    },
    onError: (error: any) => {
      toast.error(`Error updating category: ${error.message}`);
      console.error("CategoryManager: Error updating category:", error);
    }
  });
  
  // Mutation for deleting a category (removes category from menu items)
  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryName: string) => {
      console.log(`CategoryManager: Deleting category: ${categoryName}`);
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
      
      // Define the correct type for data to avoid "never" type issue
      type QueryResponse = any[] | null;
      const responseData = data as QueryResponse;
      
      // Now safely access length with proper type checking
      const updatedCount = responseData ? responseData.length : 0;
      console.log(`CategoryManager: Removed category from ${updatedCount} items`);
      return { success: true };
    },
    onSuccess: () => {
      toast.success('Category deleted successfully');
      console.log("CategoryManager: Category deleted successfully");
      
      // Force immediate refresh of all relevant queries
      refreshAllCategoryQueries();
      
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
    },
    onError: (error: any) => {
      toast.error(`Error deleting category: ${error.message}`);
      console.error("CategoryManager: Error deleting category:", error);
    }
  });
  
  // Force refetch when component mounts
  useEffect(() => {
    console.log("CategoryManager: Initial load - forcing refetch");
    refetch();
    
    // Set up periodic refresh
    const intervalId = setInterval(() => {
      console.log("CategoryManager: Periodic refresh");
      refreshAllCategoryQueries();
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, [refetch, refreshAllCategoryQueries]);
  
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
    editCategoryMutation.mutate({ 
      oldName: selectedCategory.name, 
      newName: editCategoryName.trim() 
    });
  };
  
  const handleDeleteCategory = () => {
    if (!selectedCategory) return;
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Menu Categories</h3>
        <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Category
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Loading categories...</span>
        </div>
      ) : categories.length === 0 ? (
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
      ) : (
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
                >
                  <Edit className="h-4 w-4 text-blue-500" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => openDeleteDialog(category)}
                  className="h-9 px-2.5"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddCategory}
              disabled={addCategoryMutation.isPending}
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
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditCategory}
              disabled={editCategoryMutation.isPending}
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
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the category "{selectedCategory?.name}" from all menu items.
              The menu items themselves will not be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCategory}
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
