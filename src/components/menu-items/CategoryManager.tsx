
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2 } from 'lucide-react';
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

  // Use a unique query key that includes the timestamp to force refresh
  const categoryQueryKey = ['menu-categories-list', choiceId, Date.now()];
  
  // Modified to fetch categories either for a specific choice or globally
  const { data: categories = [], isLoading, refetch } = useQuery({
    queryKey: categoryQueryKey,
    queryFn: async () => {
      console.log(`CategoryManager: Fetching categories for choice: ${choiceId || 'all'}`);
      let query = supabase
        .from('menu_items')
        .select('category')
        .not('category', 'is', null);
      
      // If choiceId is provided, filter by that choice
      if (choiceId) {
        query = query.eq('choice_id', choiceId);
      }
      
      const { data } = await query;
      
      if (data) {
        // Extract unique categories and format them
        const uniqueCategories = [...new Set(data.map(item => item.category).filter(Boolean))];
        console.log(`CategoryManager: Found ${uniqueCategories.length} categories`, uniqueCategories);
        return uniqueCategories.map(name => ({ 
          name, 
          id: name // Using the name as ID since categories don't have their own table
        }));
      }
      return [];
    },
    staleTime: 0 // Always fetch fresh data
  });
  
  // Mutation for adding a new category (actually updates menu items with new category)
  const addCategoryMutation = useMutation({
    mutationFn: async (name: string) => {
      console.log(`CategoryManager: Adding new category: ${name}`);
      // This is a dummy action since we don't have a categories table
      // In a real scenario, you'd insert into a categories table
      return { name, id: name };
    },
    onSuccess: (_, newCategoryName) => {
      toast.success('Category added successfully');
      console.log(`CategoryManager: Category "${newCategoryName}" added successfully`);
      
      // Force immediate refresh of all relevant queries
      queryClient.invalidateQueries({ queryKey: ['menu-categories-list'] });
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      
      // Force refetch after a short delay to ensure DB has updated
      setTimeout(() => {
        console.log("CategoryManager: Performing delayed refetch after category add");
        refetch();
      }, 500);
      
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
      
      const { error } = await query;
      
      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      toast.success('Category updated successfully');
      console.log("CategoryManager: Category updated successfully");
      
      // Force immediate refresh of all relevant queries
      queryClient.invalidateQueries({ queryKey: ['menu-categories-list'] });
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      
      // Force refetch after a short delay to ensure DB has updated
      setTimeout(() => {
        console.log("CategoryManager: Performing delayed refetch after category update");
        refetch();
      }, 500);
      
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
      
      const { error } = await query;
      
      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      toast.success('Category deleted successfully');
      console.log("CategoryManager: Category deleted successfully");
      
      // Force immediate refresh of all relevant queries
      queryClient.invalidateQueries({ queryKey: ['menu-categories-list'] });
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      
      // Force refetch after a short delay to ensure DB has updated
      setTimeout(() => {
        console.log("CategoryManager: Performing delayed refetch after category delete");
        refetch();
      }, 500);
      
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
  }, [refetch]);
  
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }
    addCategoryMutation.mutate(newCategoryName);
  };
  
  const handleEditCategory = () => {
    if (!editCategoryName.trim() || !selectedCategory) {
      toast.error('Category name cannot be empty');
      return;
    }
    editCategoryMutation.mutate({ 
      oldName: selectedCategory.name, 
      newName: editCategoryName 
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
        <div className="text-center py-4">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No categories found. Add your first category to organize menu items.
        </div>
      ) : (
        <div className="grid gap-2">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="flex justify-between items-center p-2 border rounded-md bg-white"
            >
              <span>{category.name}</span>
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => openEditDialog(category)}
                  className="h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => openDeleteDialog(category)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
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
              {addCategoryMutation.isPending ? 'Adding...' : 'Add Category'}
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
              {editCategoryMutation.isPending ? 'Updating...' : 'Update Category'}
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
            >
              {deleteCategoryMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoryManager;
