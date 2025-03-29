
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Save, Trash2, X } from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { MenuOption } from '@/hooks/useMenuOptions';

interface MenuOptionRowProps {
  option: MenuOption;
  isEditing: boolean;
  editedOption: { value: string; label: string };
  onEdit: () => void;
  onDelete: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditChange: (field: "value" | "label", value: string) => void;
}

const MenuOptionRow: React.FC<MenuOptionRowProps> = ({
  option,
  isEditing,
  editedOption,
  onEdit,
  onDelete,
  onSaveEdit,
  onCancelEdit,
  onEditChange,
  disabled = false
}) => {
  return (
    <TableRow>
      <TableCell className="font-mono">
        {isEditing ? (
          <Input
            value={editedOption.value}
            onChange={(e) => onEditChange("value", e.target.value)}
            className="border-zinc-200 focus-visible:ring-zinc-400"
          />
        ) : (
          option.value
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            value={editedOption.label}
            onChange={(e) => onEditChange("label", e.target.value)}
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
                onClick={onSaveEdit} 
                size="sm" 
                variant="outline" 
                disabled={disabled}
                className="text-zinc-700 border-zinc-300 hover:bg-zinc-50"
              >
                <Save className="h-3.5 w-3.5" />
              </Button>
              <Button 
                onClick={onCancelEdit} 
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
                onClick={onEdit} 
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
