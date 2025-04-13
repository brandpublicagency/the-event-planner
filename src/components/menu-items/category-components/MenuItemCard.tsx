
import React from 'react';
import { GripVertical, Edit, Trash2 } from 'lucide-react';
import { MenuItem } from '@/api/menuItemsApi';
import { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  isDragDisabled?: boolean;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  index,
  provided,
  snapshot,
  onEdit,
  onDelete,
  isDeleting,
  isDragDisabled = false
}) => {
  return (
    <div 
      ref={provided.innerRef}
      {...provided.draggableProps}
      className={`flex items-start bg-white border rounded-md p-3 my-[2px] ${snapshot.isDragging ? 'opacity-70' : ''}`}
    >
      <div {...provided.dragHandleProps} className="cursor-grab pr-2 mt-1">
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {item.label} <span className="text-xs text-gray-500">({item.value})</span>
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => onEdit(item)} 
          className="p-1 rounded-md hover:bg-gray-100 transition-colors" 
          title={`Edit ${item.label}`}
        >
          <Edit className="h-3.5 w-3.5 text-gray-500" />
          <span className="sr-only">Edit</span>
        </button>
        <button 
          onClick={() => onDelete(item.id)} 
          disabled={isDeleting} 
          className="p-1 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50" 
          title={`Delete ${item.label}`}
        >
          <Trash2 className="h-3.5 w-3.5 text-gray-500" />
          <span className="sr-only">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default MenuItemCard;
