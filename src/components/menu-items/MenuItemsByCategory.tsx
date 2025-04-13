
import React, { useMemo } from 'react';
import { MenuItem } from '@/api/menuItemsApi';
import { DragDropContext } from '@hello-pangea/dnd';
import CategoryManagerDialog from './CategoryManagerDialog';
import CategoryContainer from './category-components/CategoryContainer';
import DeleteCategoryDialog from './category-components/DeleteCategoryDialog';
import { useCategoryManager } from './hooks/useCategoryManager';
import AddItemButton from './category-components/AddItemButton';

interface MenuItemsByCategoryProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  onReorder?: (reorderedItems: MenuItem[]) => void;
  onAddItem?: (category: string | null) => void;
}

const MenuItemsByCategory: React.FC<MenuItemsByCategoryProps> = ({
  items,
  onEdit,
  onDelete,
  isDeleting,
  onReorder,
  onAddItem
}) => {
  // Group items by category
  const categorizedItems = useMemo(() => {
    console.log("Grouping items by category:", items);
    const grouped: Record<string, MenuItem[]> = {};
    
    const uncategorizedItems = items.filter(item => !item.category);
    if (uncategorizedItems.length > 0) {
      grouped['Uncategorized'] = uncategorizedItems;
    }
    
    items.forEach(item => {
      if (item.category) {
        console.log(`Found item with category: ${item.label} - ${item.category}`);
        if (!grouped[item.category]) {
          grouped[item.category] = [];
        }
        grouped[item.category].push(item);
      }
    });
    
    console.log("Grouped items:", grouped);
    return grouped;
  }, [items]);

  // Get all categories
  const allCategories = useMemo(() => {
    const categories = Object.keys(categorizedItems).sort();
    if (categories.includes('Uncategorized')) {
      return ['Uncategorized', ...categories.filter(c => c !== 'Uncategorized')];
    }
    console.log("All categories detected:", categories);
    return categories;
  }, [categorizedItems]);

  // Use the category manager hook
  const {
    isCategoryManagerOpen,
    setIsCategoryManagerOpen,
    selectedChoiceId,
    selectedChoiceLabel,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    categoryToDelete,
    isDeleting: isDeletingCategory,
    handleEditCategory,
    handleDeleteCategory,
    performDelete
  } = useCategoryManager({ items });

  // Detect if this is a buffet menu by checking the choice value
  const isBuffetMenu = useMemo(() => {
    if (!items.length) return false;
    const choiceValue = items[0]?.choice;
    return choiceValue === 'buffet-menu' || choiceValue === 'cho-buffet';
  }, [items]);

  // Handle drag and drop
  const handleDragEnd = (result: any) => {
    if (!result.destination || !onReorder) return;
    
    const sourceDroppableId = result.source.droppableId;
    const destinationDroppableId = result.destination.droppableId;
    const sourceCategory = sourceDroppableId.replace('category-', '');
    const destinationCategory = destinationDroppableId.replace('category-', '');
    
    const reorderedItems = [...items];
    const draggedItem = reorderedItems.find(item => item.id === result.draggableId);
    
    if (!draggedItem) return;
    
    const filteredItems = reorderedItems.filter(item => item.id !== result.draggableId);
    
    if (sourceCategory !== destinationCategory) {
      draggedItem.category = destinationCategory === 'Uncategorized' ? null : destinationCategory;
    }
    
    const itemsInDestination = filteredItems.filter(
      item => (item.category || 'Uncategorized') === destinationCategory
    );
    
    let newIndex = result.destination.index;
    if (newIndex > itemsInDestination.length) {
      newIndex = itemsInDestination.length;
    }
    
    itemsInDestination.splice(newIndex, 0, draggedItem);
    
    const updatedItems = filteredItems
      .filter(item => (item.category || 'Uncategorized') !== destinationCategory)
      .concat(itemsInDestination);
    
    onReorder(updatedItems);
  };

  if (allCategories.length === 0) {
    return <p className="text-center py-4 text-sm text-gray-500">No items available</p>;
  }

  // For buffet menus, render all categories inside one container
  if (isBuffetMenu) {
    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="space-y-6">
          <div className="space-y-2 border border-dashed border-gray-300 rounded-md p-3 px-[2px] py-[10px] my-[4px]">
            {allCategories.map(category => (
              <CategoryContainer
                key={category}
                category={category}
                items={categorizedItems[category]}
                onEdit={onEdit}
                onDelete={onDelete}
                isDeleting={isDeleting}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
                onAddItem={onAddItem}
                canReorder={!!onReorder}
                isBuffetCategory={true}
              />
            ))}
            
            {onAddItem && (
              <div className="mt-4">
                <AddItemButton 
                  onAddItem={onAddItem} 
                  category={allCategories[0] || 'Uncategorized'} 
                />
              </div>
            )}
          </div>
          
          {selectedChoiceId && (
            <CategoryManagerDialog 
              open={isCategoryManagerOpen} 
              onOpenChange={setIsCategoryManagerOpen} 
              choiceId={selectedChoiceId} 
              choiceLabel={selectedChoiceLabel} 
            />
          )}
          
          <DeleteCategoryDialog
            isOpen={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            categoryToDelete={categoryToDelete}
            isDeleting={isDeletingCategory}
            onConfirmDelete={performDelete}
          />
        </div>
      </DragDropContext>
    );
  }

  // For regular menus, maintain the existing behavior
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        {allCategories.map(category => (
          <CategoryContainer
            key={category}
            category={category}
            items={categorizedItems[category]}
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={isDeleting}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            onAddItem={onAddItem}
            canReorder={!!onReorder}
          />
        ))}
        
        {selectedChoiceId && (
          <CategoryManagerDialog 
            open={isCategoryManagerOpen} 
            onOpenChange={setIsCategoryManagerOpen} 
            choiceId={selectedChoiceId} 
            choiceLabel={selectedChoiceLabel} 
          />
        )}
        
        <DeleteCategoryDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          categoryToDelete={categoryToDelete}
          isDeleting={isDeletingCategory}
          onConfirmDelete={performDelete}
        />
      </div>
    </DragDropContext>
  );
};

export default MenuItemsByCategory;
