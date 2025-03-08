
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import { Trash2, Edit, Settings } from "lucide-react";
import type { Category } from '@/types/category';

export function CategoryManager() {
  const { categories, isLoadingCategories, createCategory, updateCategory, deleteCategory } = useCategories();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryColor, setCategoryColor] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryColor(category.color || '');
  };

  const handleDeleteClick = (category: Category) => {
    if (window.confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      deleteCategory(category.id);
    }
  };

  const handleSave = () => {
    if (editingCategory) {
      updateCategory({
        id: editingCategory.id,
        updates: {
          name: categoryName,
          color: categoryColor
        }
      });
      setEditingCategory(null);
    } else if (categoryName.trim()) {
      createCategory({
        name: categoryName.trim(),
        color: categoryColor
      });
    }
    
    setCategoryName('');
    setCategoryColor('');
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryColor('');
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          <span>Manage Categories</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Document Categories</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex mb-4">
            <Input
              placeholder="Category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="mr-2"
            />
            <Input
              type="color"
              value={categoryColor}
              onChange={(e) => setCategoryColor(e.target.value)}
              className="w-20"
            />
            <Button 
              onClick={handleSave} 
              disabled={!categoryName.trim()} 
              size="sm"
              className="ml-2"
            >
              {editingCategory ? 'Update' : 'Add'}
            </Button>
            {editingCategory && (
              <Button 
                onClick={handleCancel} 
                variant="ghost"
                size="sm"
                className="ml-1"
              >
                Cancel
              </Button>
            )}
          </div>
          
          <div className="max-h-60 overflow-y-auto border rounded-md">
            {isLoadingCategories ? (
              <div className="text-center py-4 text-muted-foreground">
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No categories found. Create your first one!
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-2 text-xs font-medium text-muted-foreground">Name</th>
                    <th className="text-left p-2 text-xs font-medium text-muted-foreground">Color</th>
                    <th className="text-right p-2 text-xs font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(category => (
                    <tr key={category.id} className="border-t">
                      <td className="p-2 text-sm">{category.name}</td>
                      <td className="p-2">
                        <div 
                          className="w-5 h-5 rounded-full" 
                          style={{ backgroundColor: category.color || '#888' }}
                        ></div>
                      </td>
                      <td className="p-2 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleEditClick(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleDeleteClick(category)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
