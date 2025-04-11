
import React, { useState } from 'react';
import { MenuItem } from '@/api/menuItemsApi';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, GripVertical, Plus } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

type MenuItemsTableProps = {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onReorder?: (reorderedItems: MenuItem[]) => void;
  isDeleting: boolean;
  useCategories?: boolean;
  availableCategories?: string[];
  onAddItem?: (category: string | null) => void;
};

const MenuItemsTable: React.FC<MenuItemsTableProps> = ({
  items,
  onEdit,
  onDelete,
  onReorder,
  isDeleting,
  useCategories = false,
  availableCategories = [],
  onAddItem
}) => {
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  const handleDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination || !onReorder) return;

    // Make a copy of the items
    const reorderedItems = [...items];

    // Remove from source and insert at destination
    const [reorderedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, reorderedItem);

    // If category should change
    if (useCategories && result.source.droppableId !== result.destination.droppableId) {
      const newCategory = result.destination.droppableId === 'uncategorized' 
        ? null 
        : result.destination.droppableId;
      
      reorderedItem.category = newCategory;
    }

    onReorder(reorderedItems);
  };

  // Simple list without categories
  const renderSimpleList = () => (
    <Droppable droppableId="items" direction="vertical">
      {provided => (
        <div 
          {...provided.droppableProps} 
          ref={provided.innerRef}
          className="space-y-2"
        >
          {items.map((item, index) => (
            <Draggable 
              key={item.id} 
              draggableId={item.id} 
              index={index}
              isDragDisabled={!onReorder}
            >
              {provided => (
                <div 
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  className="flex items-center bg-white border rounded-md p-2 mb-2"
                >
                  {onReorder && (
                    <div {...provided.dragHandleProps} className="cursor-grab pr-2">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="text-sm">{item.label}</div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(item)} className="h-6 w-6">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setItemToDelete(item)} className="h-6 w-6">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );

  // Categorized list
  const renderCategorizedList = () => {
    // Group items by category
    const categoryGroups: Record<string, MenuItem[]> = {};
    
    // Initialize categories
    ['uncategorized', ...availableCategories].forEach(cat => {
      categoryGroups[cat === 'uncategorized' ? cat : cat] = [];
    });
    
    // Group items
    items.forEach(item => {
      const category = item.category || 'uncategorized';
      if (!categoryGroups[category]) {
        categoryGroups[category] = [];
      }
      categoryGroups[category].push(item);
    });
    
    return (
      <div className="space-y-4">
        {Object.entries(categoryGroups).map(([category, categoryItems]) => {
          // Skip empty categories except uncategorized
          if (category !== 'uncategorized' && categoryItems.length === 0 && !onAddItem) {
            return null;
          }
          
          return (
            <div key={category} className="mb-4">
              {category !== 'uncategorized' && (
                <div className="mb-1 px-1">
                  <div className="inline-flex items-center text-xs font-semibold py-1 px-3 rounded-md bg-gray-100 text-gray-700">
                    {category}
                  </div>
                </div>
              )}
              
              <Droppable droppableId={category} direction="vertical">
                {provided => (
                  <div 
                    {...provided.droppableProps} 
                    ref={provided.innerRef}
                    className="space-y-1 min-h-10"
                  >
                    {categoryItems.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={!onReorder}>
                        {provided => (
                          <div 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center bg-white border rounded-md p-2 mb-1"
                          >
                            {onReorder && (
                              <div {...provided.dragHandleProps} className="cursor-grab pr-2">
                                <GripVertical className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                            
                            <div className="flex-1">
                              <div className="text-sm">{item.label}</div>
                            </div>
                            
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="icon" onClick={() => onEdit(item)} className="h-6 w-6">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => setItemToDelete(item)} className="h-6 w-6">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {/* Add item button for this category */}
                    {onAddItem && (
                      <Button 
                        size="sm" 
                        onClick={() => onAddItem(category === 'uncategorized' ? null : category)} 
                        className="w-full mt-1 border border-dashed border-gray-200 bg-transparent hover:bg-gray-50 text-gray-500 hover:text-gray-700 py-1"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        <span className="text-xs">Add to {category === 'uncategorized' ? 'Items' : category}</span>
                      </Button>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-2 text-sm text-gray-500">
            No items yet
          </div>
        ) : (
          useCategories ? renderCategorizedList() : renderSimpleList()
        )}

        <AlertDialog open={!!itemToDelete} onOpenChange={open => !open && setItemToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the menu item "{itemToDelete?.label}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DragDropContext>
  );
};

export default MenuItemsTable;
