
import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Save } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { MenuOption } from "../MenuSettingsBase";

interface MenuOptionRowProps {
  option: MenuOption;
  isEditing: boolean;
  editedOption: { value: string; label: string };
  onEdit: (option: MenuOption) => void;
  onDelete: (id: string) => void;
  onSaveEdit: (id: string) => void;
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
}) => {
  return (
    <TableRow key={option.id}>
      <TableCell>
        {isEditing ? (
          <Input
            value={editedOption.value}
            onChange={(e) => onEditChange("value", e.target.value)}
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
          />
        ) : (
          option.label
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <div className="flex gap-2">
            <Button onClick={() => onSaveEdit(option.id)} size="sm" variant="outline">
              <Save className="h-3.5 w-3.5" />
            </Button>
            <Button onClick={onCancelEdit} size="sm" variant="outline">
              <Trash2 className="h-3.5 w-3.5 text-red-500" />
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button onClick={() => onEdit(option)} size="sm" variant="outline">
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button onClick={() => onDelete(option.id)} size="sm" variant="outline">
              <Trash2 className="h-3.5 w-3.5 text-red-500" />
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

export default MenuOptionRow;
