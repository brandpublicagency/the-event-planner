import { NoteItem } from "../NoteItem";

interface NotesListProps {
  notes: string[];
  editingIndex: number | null;
  editingText: string;
  onEditingTextChange: (text: string) => void;
  onEditSubmit: (index: number) => void;
  onEditStart: (index: number, note: string) => void;
  onEditCancel: () => void;
  onDelete: (index: number) => void;
}

export function NotesList({
  notes,
  editingIndex,
  editingText,
  onEditingTextChange,
  onEditSubmit,
  onEditStart,
  onEditCancel,
  onDelete,
}: NotesListProps) {
  return (
    <div className="space-y-2">
      {notes?.map((note, index) => (
        <NoteItem
          key={index}
          note={note}
          isEditing={editingIndex === index}
          editingText={editingText}
          onEditingTextChange={onEditingTextChange}
          onEditSubmit={() => onEditSubmit(index)}
          onEditStart={() => onEditStart(index, note)}
          onEditCancel={onEditCancel}
          onDelete={() => onDelete(index)}
        />
      ))}
      {(!notes || notes.length === 0) && (
        <p className="text-center text-sm text-muted-foreground py-4">
          No notes added yet
        </p>
      )}
    </div>
  );
}