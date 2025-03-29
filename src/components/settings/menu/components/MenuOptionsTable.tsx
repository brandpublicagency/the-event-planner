
import React from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MenuOption } from "../MenuSettingsBase";
import AddOptionRow from "./AddOptionRow";
import MenuOptionRow from "./MenuOptionRow";
import EmptyState from "./EmptyState";

interface MenuOptionsTableProps {
  options: MenuOption[];
  isAdding: boolean;
  editingId: string | null;
  newOption: { value: string; label: string };
  editedOption: { value: string; label: string };
  onEdit: (option: MenuOption) => void;
  onDelete: (id: string) => void;
  onSaveEdit: (id: string) => void;
  onCancelEdit: () => void;
  onSaveNew: () => void;
  onCancelAdd: () => void;
  onNewOptionChange: (field: "value" | "label", value: string) => void;
  onEditChange: (field: "value" | "label", value: string) => void;
}

const MenuOptionsTable: React.FC<MenuOptionsTableProps> = ({
  options,
  isAdding,
  editingId,
  newOption,
  editedOption,
  onEdit,
  onDelete,
  onSaveEdit,
  onCancelEdit,
  onSaveNew,
  onCancelAdd,
  onNewOptionChange,
  onEditChange,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Value</TableHead>
          <TableHead>Label</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isAdding && (
          <AddOptionRow
            newOption={newOption}
            onSaveNew={onSaveNew}
            onCancelAdd={onCancelAdd}
            onNewOptionChange={onNewOptionChange}
          />
        )}
        
        {options.map((option) => (
          <MenuOptionRow
            key={option.id}
            option={option}
            isEditing={editingId === option.id}
            editedOption={editedOption}
            onEdit={onEdit}
            onDelete={onDelete}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
            onEditChange={onEditChange}
          />
        ))}
        
        {options.length === 0 && !isAdding && <EmptyState />}
      </TableBody>
    </Table>
  );
};

export default MenuOptionsTable;
