
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface AddOptionRowProps {
  newOption: { value: string; label: string };
  onSaveNew: () => void;
  onCancelAdd: () => void;
  onNewOptionChange: (field: "value" | "label", value: string) => void;
}

const AddOptionRow: React.FC<AddOptionRowProps> = ({
  newOption,
  onSaveNew,
  onCancelAdd,
  onNewOptionChange,
}) => {
  return (
    <TableRow>
      <TableCell>
        <Input
          value={newOption.value}
          onChange={(e) => onNewOptionChange("value", e.target.value)}
          placeholder="Enter value (e.g. 'chicken_breast')"
          className="border-zinc-200 focus-visible:ring-zinc-400"
        />
      </TableCell>
      <TableCell>
        <Input
          value={newOption.label}
          onChange={(e) => onNewOptionChange("label", e.target.value)}
          placeholder="Enter display label"
          className="border-zinc-200 focus-visible:ring-zinc-400"
        />
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button onClick={onSaveNew} size="sm" variant="outline" className="text-zinc-700 border-zinc-300 hover:bg-zinc-50">
            <Save className="h-3.5 w-3.5" />
          </Button>
          <Button onClick={onCancelAdd} size="sm" variant="outline" className="border-zinc-300 hover:bg-zinc-50">
            <Trash2 className="h-3.5 w-3.5 text-red-500" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default AddOptionRow;
