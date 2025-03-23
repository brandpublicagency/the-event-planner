import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RefObject } from "react";
interface AddTaskInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  inputRef?: RefObject<HTMLInputElement>;
}
export function AddTaskInput({
  value,
  onChange,
  onSubmit,
  inputRef
}: AddTaskInputProps) {
  return <div className="flex items-center gap-2 mt-2">
      <Input placeholder="Add a new task..." value={value} onChange={e => onChange(e.target.value)} onKeyDown={e => {
      if (e.key === "Enter") {
        onSubmit();
      }
    }} className="h-9" ref={inputRef} />
      <Button size="sm" onClick={onSubmit} disabled={!value.trim()} className="h-9 text-xs font-normal bg-zinc-50 text-zinc-600">
        <Plus className="h-4 w-4" />
      </Button>
    </div>;
}