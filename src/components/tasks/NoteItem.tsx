
import { Button } from "@/components/ui/button";
import { Pencil, X } from "lucide-react";
import { NoteInput } from "./NoteInput";

interface NoteItemProps {
  note: string;
  isEditing: boolean;
  editingText: string;
  onEditingTextChange: (text: string) => void;
  onEditSubmit: () => void;
  onEditStart: () => void;
  onEditCancel: () => void;
  onDelete: () => void;
}

export function NoteItem({
  note,
  isEditing,
  editingText,
  onEditingTextChange,
  onEditSubmit,
  onEditStart,
  onEditCancel,
  onDelete,
}: NoteItemProps) {
  if (isEditing) {
    return (
      <div className="flex-1 flex gap-2">
        <NoteInput
          value={editingText}
          onChange={onEditingTextChange}
          onSubmit={onEditSubmit}
          autoFocus
        />
        <Button
          variant="outline"
          size="icon"
          className="h-[60px] w-[60px] rounded-full bg-white border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900"
          onClick={onEditCancel}
        >
          <X className="h-4 w-4 text-zinc-700" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between py-2 px-3 rounded-lg border group hover:bg-accent/50 transition-colors">
      <span className="text-sm whitespace-pre-line">{note}</span>
      <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-white border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900"
          onClick={onEditStart}
        >
          <Pencil className="h-4 w-4 text-zinc-700" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-white border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900"
          onClick={onDelete}
        >
          <X className="h-4 w-4 text-zinc-700" />
        </Button>
      </div>
    </div>
  );
}
