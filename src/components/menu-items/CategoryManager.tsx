import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, Loader2, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
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
const CategoryManager: React.FC<CategoryManagerProps> = ({
  choiceId
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const queryClient = useQueryClient();

  // Force a refresh manually
  const forceRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);
  const {
    data: categories = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['menu-categories-fixed', choiceId, refreshTrigger],
    queryFn: async () => {
      console.log(`CategoryManager: Fetching categories for choice: ${choiceId || 'all'}`);
      if (!choiceId) {
        console.log("No choiceId provided, returning empty list");
        return [];
      }
      try {
        // Direct query for categories by choice_id
        const {
          data,
          error
        } = await supabase.from('menu_items').select('category').eq('choice_id', choiceId).not('category', 'is', null);
        if (error) {
          console.error("Error fetching categories:", error);
          toast.error("Failed to load categories");
          return [];
        }
        if (data && data.length > 0) {
          // Extract unique categories and format them
          const categoryNames = data.map(item => item.category).filter(Boolean);
          const uniqueCategories = [...new Set(categoryNames)];
          console.log(`CategoryManager: Found ${uniqueCategories.length} categories:`, uniqueCategories);
          return uniqueCategories.map(name => ({
            name,
            id: name // Using the name as ID since categories don't have their own table
          }));
        }
        console.log("No categories found for this choice");
        return [];
      } catch (err) {
        console.error("Unexpected error in fetchCategories:", err);
        toast.error("An unexpected error occurred while loading categories");
        return [];
      }
    },
    staleTime: 0,
    // Always fetch fresh data
    retry: 3,
    // Retry failed requests 3 times
    refetchOnWindowFocus: true
  });

  // Mutation for adding a new category
  const addCategoryMutation = useMutation({
    mutationFn: async (name: string) => {
      console.log(`CategoryManager: Adding new category: ${name}`);
      if (!choiceId) {
        throw new Error("No choice ID provided");
      }

      // Create a dummy item with the new category
      const {
        data,
        error
      } = await supabase.from('menu_items').insert({
        label: `Placeholder for ${name}`,
        value: `placeholder-${name.toLowerCase().replace(/\s+/g, '-')}`,
        category: name,
        choice_id: choiceId,
        choice: 'placeholder'
      }).select();
      if (error) throw error;
      return {
        name,
        id: name
      };
    },
    onSuccess: (_, newCategoryName) => {
      toast.success('Category added successfully');

      // Force refresh
      forceRefresh();
      queryClient.invalidateQueries({
        queryKey: ['menu-categories-fixed']
      });
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
    mutationFn: async ({
      oldName,
      newName
    }: {
      oldName: string;
      newName: string;
    }) => {
      console.log(`CategoryManager: Updating category from "${oldName}" to "${newName}"`);
      if (!choiceId) {
        throw new Error("No choice ID provided");
      }

      // Update all items with the matching category
      const {
        data,
        error
      } = await supabase.from('menu_items').update({
        category: newName
      }).eq('category', oldName).eq('choice_id', choiceId);
      if (error) throw error;
      return {
        success: true,
        oldName,
        newName
      };
    },
    onSuccess: result => {
      if (result && result.oldName && result.newName) {
        toast.success(`Category "${result.oldName}" updated to "${result.newName}"`);
      } else {
        toast.success('Category updated successfully');
      }

      // Force refresh
      forceRefresh();
      queryClient.invalidateQueries({
        queryKey: ['menu-categories-fixed']
      });
      setIsEditDialogOpen(false);
      setSelectedCategory(null);
      setEditCategoryName('');
    },
    onError: (error: any) => {
      toast.error(`Error updating category: ${error.message}`);
      console.error("CategoryManager: Error updating category:", error);
    }
  });

  // Mutation for deleting a category
  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryName: string) => {
      console.log(`CategoryManager: Deleting category: ${categoryName}`);
      if (!choiceId) {
        throw new Error("No choice ID provided");
      }

      // Update all items with the matching category to remove the category
      const {
        data,
        error
      } = await supabase.from('menu_items').update({
        category: null
      }).eq('category', categoryName).eq('choice_id', choiceId);
      if (error) throw error;
      return {
        success: true,
        categoryName
      };
    },
    onSuccess: result => {
      if (result && result.categoryName) {
        toast.success(`Category "${result.categoryName}" deleted successfully`);
      } else {
        toast.success('Category deleted successfully');
      }

      // Force refresh
      forceRefresh();
      queryClient.invalidateQueries({
        queryKey: ['menu-categories-fixed']
      });
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
    },
    onError: (error: any) => {
      toast.error(`Error deleting category: ${error.message}`);
      console.error("CategoryManager: Error deleting category:", error);
    }
  });
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
    if (isLoading) {
      return <div className="flex flex-col justify-center items-center py-6">
          <Loader2 className="h-6 w-6 text-primary animate-spin mb-2" />
          <span className="text-xs text-muted-foreground">Loading categories...</span>
        </div>;
    }

    // Show empty state
    if (!categories || categories.length === 0) {
      return <div className="text-center py-6 border rounded-md bg-muted/20">
          <p className="text-sm text-muted-foreground">
            No categories found. Add your first category to organize menu items.
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)} variant="outline" size="sm" className="mt-2">
            <Plus className="h-4 w-4 mr-1" />
            Add Category
          </Button>
        </div>;
    }

    // Show categories list
    return <div className="grid gap-2">
        {categories.map(category => <div key={category.id} className="flex justify-between items-center p-3 border rounded-md transition-colors py-[5px] px-[10px] bg-transparent">
            <span className="text-sm font-normal">{category.name}</span>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={() => openEditDialog(category)} disabled={editCategoryMutation.isPending || deleteCategoryMutation.isPending} className="h-9 px-2.5 text-gray-800">
                {editCategoryMutation.isPending && selectedCategory?.id === category.id ? <Loader2 className="h-4 w-4 animate-spin text-blue-500" /> : <Edit className="h-4 w-4 text-blue-500" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(category)} disabled={editCategoryMutation.isPending || deleteCategoryMutation.isPending} className="h-9 px-2.5 text-zinc-600">
                {deleteCategoryMutation.isPending && selectedCategory?.id === category.id ? <Loader2 className="h-4 w-4 animate-spin text-red-500" /> : <Trash2 className="h-4 w-4 text-red-500" />}
              </Button>
            </div>
          </div>)}
      </div>;
  };

  // Show error state if there was an error fetching categories
  if (error) {
    return <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Menu Categories</h3>
          <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Category
          </Button>
        </div>
        
        <div className="text-center py-6 border rounded-md bg-red-50">
          <p className="text-red-500 mb-2 text-sm">
            Failed to load categories. Please try again.
          </p>
          <Button onClick={() => {
          forceRefresh();
          refetch();
        }} variant="outline" size="sm" className="mt-2">
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        </div>
        
        {/* Add Category Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input placeholder="Category name" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} autoFocus />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={addCategoryMutation.isPending}>
                Cancel
              </Button>
              <Button onClick={handleAddCategory} disabled={addCategoryMutation.isPending || !newCategoryName.trim()}>
                {addCategoryMutation.isPending ? <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </> : 'Add Category'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Category Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={open => {
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
              <Input placeholder="Category name" value={editCategoryName} onChange={e => setEditCategoryName(e.target.value)} autoFocus />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={editCategoryMutation.isPending}>
                Cancel
              </Button>
              <Button onClick={handleEditCategory} disabled={editCategoryMutation.isPending || !editCategoryName.trim()}>
                {editCategoryMutation.isPending ? <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </> : 'Update Category'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Category Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={open => {
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
              <AlertDialogAction onClick={e => {
              e.preventDefault(); // Prevent the dialog from closing automatically
              handleDeleteCategory();
            }} disabled={deleteCategoryMutation.isPending} className="bg-red-500 hover:bg-red-600">
                {deleteCategoryMutation.isPending ? <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </> : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>;
  }
  return <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-xs text-gray-700">Menu Categories</h3>
        <div className="flex gap-2">
          <Button onClick={() => {
          forceRefresh();
          refetch();
        }} variant="outline" size="sm" title="Refresh categories">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Category
          </Button>
        </div>
      </div>
      
      {renderContent()}
    </div>;
};
export default CategoryManager;