
import React from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MenuOption } from "@/hooks/useMenuOptions";
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
  onAddItem: () => void;
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
  onAddItem,
}) => {
  console.log("MenuOptionsTable rendering with options:", options, "isAdding:", isAdding);
  
  const hasOptions = Array.isArray(options) && options.length > 0;
  
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
        
        {hasOptions ? (
          options.map((option) => (
            <MenuOptionRow
              key={option.id}
              option={option}
              isEditing={editingId === option.id}
              editedOption={editedOption}
              onEdit={() => onEdit(option)}
              onDelete={() => onDelete(option.id)}
              onSaveEdit={() => onSaveEdit(option.id)}
              onCancelEdit={onCancelEdit}
              onEditChange={onEditChange}
              disabled={isAdding}
            />
          ))
        ) : (
          !isAdding && (
            <EmptyState 
              title="No options configured" 
              description="Add your first menu option to get started" 
              onAdd={onAddItem} 
            />
          )
        )}
      </TableBody>
    </Table>
  );
};

export default MenuOptionsTable;
