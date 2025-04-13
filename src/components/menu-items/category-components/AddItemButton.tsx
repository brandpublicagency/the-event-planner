
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddItemButtonProps {
  onAddItem: (category: string | null) => void;
  category: string;
}

const AddItemButton: React.FC<AddItemButtonProps> = ({ onAddItem, category }) => {
  return (
    <div className="pt-2 pb-3 py-[4px]">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onAddItem(category !== 'Uncategorized' ? category : null)} 
        className="w-full flex items-center justify-center border border-dashed border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-500 py-[10px]"
      >
        <Plus className="h-3.5 w-3.5 mr-1" />
        Add Item
      </Button>
    </div>
  );
};

export default AddItemButton;
