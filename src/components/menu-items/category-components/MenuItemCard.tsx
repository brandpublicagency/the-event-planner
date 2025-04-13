
import React from 'react';
import { MenuItem } from '@/api/types/menuItems';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onEdit,
  onDelete,
  isDeleting
}) => {
  return (
    <div className="flex items-start bg-white border rounded-md p-2 transition-colors">
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm font-medium text-gray-800">
              {item.label} <span className="font-light text-xs text-gray-300">({item.value})</span>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEdit(item)} 
              className="h-6 w-6 text-zinc-400"
              disabled={isDeleting}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(item.id)} 
              className="h-6 w-6 text-zinc-400"
              disabled={isDeleting}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
