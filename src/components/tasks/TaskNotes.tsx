import { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { CheckSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { TodoList } from "./TodoList";
import { useToast } from "@/components/ui/use-toast";
import { NoteInput } from "./NoteInput";
import { NoteItem } from "./NoteItem";

export function TaskNotes({ taskId }: { taskId: string }) {
  const { toast } = useToast();
  const [newNote, setNewNote] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const { tasks, updateTask } = useTaskContext();
  const task = tasks.find((t) => t.id === taskId);

  const handleAddNote = async () => {
    if (!newNote.trim() || !task) return;
    const updatedNotes = [...(task.notes || []), newNote];
    try {
      await updateTask(taskId, { notes: updatedNotes });
      setNewNote("");
    } catch (error) {
      toast({
        title: "Error adding note",
        description: "Failed to add note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveNote = async (index: number) => {
    if (!task) return;
    const updatedNotes = task.notes?.filter((_, i) => i !== index);
    try {
      await updateTask(taskId, { notes: updatedNotes });
    } catch (error) {
      toast({
        title: "Error removing note",
        description: "Failed to remove note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditNote = async (index: number) => {
    if (!task || !editingText.trim()) return;
    const updatedNotes = [...(task.notes || [])];
    updatedNotes[index] = editingText;
    try {
      await updateTask(taskId, { notes: updatedNotes });
      setEditingIndex(null);
      setEditingText("");
    } catch (error) {
      toast({
        title: "Error updating note",
        description: "Failed to update note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTodosChange = async (todos: string[]) => {
    if (!task) return;
    try {
      await updateTask(taskId, { todos });
    } catch (error) {
      toast({
        title: "Error updating todos",
        description: "Failed to update todo list. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!task) return null;

  return (
    <div className="space-y-6">
      {/* Notes Section */}
      <div className="space-y-3">
        <NoteInput
          value={newNote}
          onChange={setNewNote}
          onSubmit={handleAddNote}
        />

        <div className="space-y-2">
          {task.notes?.map((note, index) => (
            <NoteItem
              key={index}
              note={note}
              isEditing={editingIndex === index}
              editingText={editingText}
              onEditingTextChange={setEditingText}
              onEditSubmit={() => handleEditNote(index)}
              onEditStart={() => {
                setEditingIndex(index);
                setEditingText(note);
              }}
              onEditCancel={() => setEditingIndex(null)}
              onDelete={() => handleRemoveNote(index)}
            />
          ))}
          {(!task.notes || task.notes.length === 0) && (
            <p className="text-center text-sm text-muted-foreground py-4">
              No notes added yet
            </p>
          )}
        </div>
      </div>

      <Separator />

      {/* Checklist Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Checklist</h3>
        </div>
        <TodoList 
          todos={task.todos || []}
          onTodosChange={handleTodosChange}
          taskId={taskId}
        />
      </div>
    </div>
  );
}