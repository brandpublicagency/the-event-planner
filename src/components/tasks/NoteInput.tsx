import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

interface NoteInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function NoteInput({ 
  value, 
  onChange, 
  onSubmit, 
  placeholder = "Add a note...",
  autoFocus = false 
}: NoteInputProps) {
  return (
    <div className="flex gap-2 items-center">
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
        className="min-h-[60px] text-sm resize-none"
        rows={2}
        autoFocus={autoFocus}
      />
      <Button 
        onClick={onSubmit} 
        disabled={!value.trim()}
        size="icon"
        className="h-8 w-8 rounded-full"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}