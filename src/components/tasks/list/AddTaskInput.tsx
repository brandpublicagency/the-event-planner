
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useRef } from "react";

interface AddTaskInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export function AddTaskInput({ 
  value, 
  onChange, 
  onSubmit,
  inputRef,
}: AddTaskInputProps) {
  const defaultRef = useRef<HTMLInputElement>(null);
  const ref = inputRef || defaultRef;

  return (
    <div className="flex gap-1.5 items-center mt-2">
      <Input
        ref={ref}
        placeholder="Add a task..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSubmit();
          }
        }}
        className="text-xs h-9"
      />
      <Button 
        onClick={onSubmit} 
        disabled={!value.trim()}
        size="icon"
        variant="outline"
        className="h-9 w-9 rounded-full bg-background border-border hover:bg-muted hover:text-foreground"
      >
        <Plus className="h-3.5 w-3.5 text-foreground" />
      </Button>
    </div>
  );
}
