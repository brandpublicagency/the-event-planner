
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
    <div className="flex gap-2 items-center mt-2">
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
        className="text-sm"
      />
      <Button 
        onClick={onSubmit} 
        disabled={!value.trim()}
        size="icon"
        variant="outline"
        className="h-8 w-8 rounded-full bg-white border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900"
      >
        <Plus className="h-4 w-4 text-zinc-700" />
      </Button>
    </div>
  );
}
