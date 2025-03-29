
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Save, Trash2, X } from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { MenuOption } from '@/hooks/useMenuOptions';

interface MenuOptionRowProps {
  option: MenuOption;
  onDelete: () => void;
  onEdit: (updatedOption: { value: string; label: string }) => void;
  disabled?: boolean;
}

const MenuOptionRow: React.FC<MenuOptionRowProps> = ({
  option,
  onDelete,
  onEdit,
  disabled = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(option.value);
  const [editedLabel, setEditedLabel] = useState(option.label);

  const handleSave = () => {
    onEdit({ value: editedValue, label: editedLabel });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedValue(option.value);
    setEditedLabel(option.label);
    setIsEditing(false);
  };

  return (
    <TableRow>
      <TableCell className="font-mono">
        {isEditing ? (
          <Input
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            className="border-zinc-200 focus-visible:ring-zinc-400"
          />
        ) : (
          option.value
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            value={editedLabel}
            onChange={(e) => setEditedLabel(e.target.value)}
            className="border-zinc-200 focus-visible:ring-zinc-400"
          />
        ) : (
          option.label
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {isEditing ? (
            <>
              <Button 
                onClick={handleSave} 
                size="sm" 
                variant="outline" 
                disabled={disabled}
                className="text-zinc-700 border-zinc-300 hover:bg-zinc-50"
              >
                <Save className="h-3.5 w-3.5" />
              </Button>
              <Button 
                onClick={handleCancel} 
                size="sm" 
                variant="outline" 
                disabled={disabled}
                className="border-zinc-300 hover:bg-zinc-50"
              >
                <X className="h-3.5 w-3.5 text-zinc-500" />
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={() => setIsEditing(true)} 
                size="sm" 
                variant="outline" 
                disabled={disabled}
                className="text-zinc-700 border-zinc-300 hover:bg-zinc-50"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button 
                onClick={onDelete} 
                size="sm" 
                variant="outline" 
                disabled={disabled}
                className="border-zinc-300 hover:bg-zinc-50"
              >
                <Trash2 className="h-3.5 w-3.5 text-red-500" />
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default MenuOptionRow;
