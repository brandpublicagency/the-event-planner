import { NoteInput } from "../NoteInput";
import { NotesList } from "./NotesList";
import { Separator } from "@/components/ui/separator";
import { TodoList } from "../TodoList";

interface NotesSectionProps {
  taskId: string;
  notes: string[];
  todos: string[];
  newNote: string;
  editingIndex: number | null;
  editingText: string;
  onNewNoteChange: (note: string) => void;
  onAddNote: () => void;
  onEditingTextChange: (text: string) => void;
  onEditNote: (index: number) => void;
  onEditStart: (index: number, note: string) => void;
  onEditCancel: () => void;
  onDeleteNote: (index: number) => void;
  onTodosChange: (todos: string[]) => void;
}

export function NotesSection({
  taskId,
  notes,
  todos,
  newNote,
  editingIndex,
  editingText,
  onNewNoteChange,
  onAddNote,
  onEditingTextChange,
  onEditNote,
  onEditStart,
  onEditCancel,
  onDeleteNote,
  onTodosChange,
}: NotesSectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <NoteInput
          value={newNote}
          onChange={onNewNoteChange}
          onSubmit={onAddNote}
        />

        <NotesList
          notes={notes}
          editingIndex={editingIndex}
          editingText={editingText}
          onEditingTextChange={onEditingTextChange}
          onEditSubmit={onEditNote}
          onEditStart={onEditStart}
          onEditCancel={onEditCancel}
          onDelete={onDeleteNote}
        />
      </div>

      <Separator />

      <div className="space-y-3">
        <TodoList 
          todos={todos}
          onTodosChange={onTodosChange}
          taskId={taskId}
        />
      </div>
    </div>
  );
}