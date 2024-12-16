import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddTaskInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function AddTaskInput({ value, onChange, onSubmit }: AddTaskInputProps) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <Input
        placeholder="Add a new task..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSubmit();
          }
        }}
        className="h-9"
      />
      <Button 
        size="sm"
        onClick={onSubmit}
        disabled={!value.trim()}
        className="h-9"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}