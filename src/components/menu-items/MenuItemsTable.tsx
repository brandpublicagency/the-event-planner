import React, { useState } from 'react';
import { MenuItem } from '@/api/menuItemsApi';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, GripVertical } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
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
    const reorderedItems = Array.from(items);
    const [reorderedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, reorderedItem);
    onReorder(reorderedItems);
  };
  return <div className="space-y-4">
      {items.length === 0 ? <div className="text-center py-4 text-gray-500">
          No menu items found
        </div> : <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="menu-items" direction="vertical">
            {provided => <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {items.map((item, index) => <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={!onReorder}>
                    {provided => <div ref={provided.innerRef} {...provided.draggableProps} className="flex items-start mb-4">
                        {onReorder && <div {...provided.dragHandleProps} className="cursor-grab pr-2 mt-1">
                            <GripVertical className="h-5 w-5 text-gray-400" />
                          </div>}
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-xs text-gray-800">{item.label}</div>
                              <div className="text-xs text-gray-500 mt-1">{item.value}</div>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => setItemToDelete(item)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {item.description && <div className="text-sm text-gray-700 mt-2">
                              {item.description}
                            </div>}
                        </div>
                      </div>}
                  </Draggable>)}
                {provided.placeholder}
              </div>}
          </Droppable>
        </DragDropContext>}

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
    </div>;
};
export default MenuItemsTable;