
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { MenuItem } from '@/api/menuItemsApi';

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  isDragDisabled?: boolean;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onEdit,
  onDelete,
  isDeleting
}) => {
  return (
    <div className="flex items-start bg-white border rounded-md p-3 my-[2px]">
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
