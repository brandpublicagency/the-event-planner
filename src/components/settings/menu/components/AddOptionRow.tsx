
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';

interface AddOptionRowProps {
  newOption: { value: string; label: string };
  onSaveNew: () => void;
  onCancelAdd: () => void;
  onNewOptionChange: (field: "value" | "label", value: string) => void;
  disabled?: boolean;
}

const AddOptionRow: React.FC<AddOptionRowProps> = ({
  newOption,
  onSaveNew,
  onCancelAdd,
  onNewOptionChange,
  disabled = false
}) => {
  return (
    <TableRow className="bg-zinc-50">
      <TableCell>
        <Input
          value={newOption.value}
          onChange={(e) => onNewOptionChange("value", e.target.value)}
          placeholder="Option value"
          className="border-zinc-200 focus-visible:ring-zinc-400"
        />
      </TableCell>
      <TableCell>
        <Input
          value={newOption.label}
          onChange={(e) => onNewOptionChange("label", e.target.value)}
          placeholder="Display name"
          className="border-zinc-200 focus-visible:ring-zinc-400"
        />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button 
            onClick={onSaveNew} 
            size="sm" 
            variant="outline" 
            disabled={disabled || !newOption.value || !newOption.label}
            className="text-zinc-700 border-zinc-300 hover:bg-zinc-50"
          >
            <Save className="h-3.5 w-3.5" />
          </Button>
          <Button 
            onClick={onCancelAdd} 
            size="sm" 
            variant="outline" 
            disabled={disabled}
            className="border-zinc-300 hover:bg-zinc-50"
          >
            <X className="h-3.5 w-3.5 text-zinc-500" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default AddOptionRow;
