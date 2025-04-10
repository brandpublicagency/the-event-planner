
import React, { useState } from 'react';
import { MenuItem } from '@/api/menuItemsApi';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, GripVertical } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Badge } from '@/components/ui/badge';

type MenuItemsTableProps = {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onReorder?: (reorderedItems: MenuItem[]) => void;
  isDeleting: boolean;
};

const MenuItemsTable: React.FC<MenuItemsTableProps> = ({
  items,
  onEdit,
  onDelete,
  onReorder,
  isDeleting
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
    
    // If dragging between different categories, we need to handle differently
    const sourceDroppableId = result.source.droppableId;
    const destinationDroppableId = result.destination.droppableId;
    
    // Make a copy of the items
    const reorderedItems = [...items];
    
    // If dragging within the same category
    const [reorderedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, reorderedItem);
    
    // If category changed, update the item's category
    if (sourceDroppableId !== destinationDroppableId) {
      const categoryId = destinationDroppableId.replace('category-', '');
      if (categoryId !== 'Uncategorized') {
        reorderedItem.category = categoryId;
      } else {
        reorderedItem.category = null;
      }
    }
    
    onReorder(reorderedItems);
  };

  // Group items by category
  const groupedItems: { [key: string]: MenuItem[] } = {};
  items.forEach(item => {
    const category = item.category || 'Uncategorized';
    if (!groupedItems[category]) {
      groupedItems[category] = [];
    }
    groupedItems[category].push(item);
  });

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No menu items found
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <div key={category} className="mb-6">
              <div className="mb-2">
                <Badge variant="outline" className="text-xs font-medium">
                  {category}
                </Badge>
              </div>
              <Droppable droppableId={`category-${category}`} direction="vertical">
                {provided => (
                  <div 
                    {...provided.droppableProps} 
                    ref={provided.innerRef} 
                    className="space-y-2 border border-dashed border-gray-200 rounded-md p-2"
                  >
                    {categoryItems.map((item, index) => (
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
                            className="flex items-start bg-white border rounded-md p-2 mb-2"
                          >
                            {onReorder && (
                              <div {...provided.dragHandleProps} className="cursor-grab pr-2 mt-1">
                                <GripVertical className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="text-sm font-medium text-gray-800">{item.label}</div>
                                  <div className="text-xs text-gray-500 py-px">{item.value}</div>
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
                              
                              {item.description && (
                                <div className="text-xs text-gray-700 mt-2">
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
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
  );
};

export default MenuItemsTable;
