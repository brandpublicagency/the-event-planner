import { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { useToast } from "@/components/ui/use-toast";
import { NotesSection } from "./notes/NotesSection";

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
    <NotesSection
      taskId={taskId}
      notes={task.notes || []}
      todos={task.todos || []}
      newNote={newNote}
      editingIndex={editingIndex}
      editingText={editingText}
      onNewNoteChange={setNewNote}
      onAddNote={handleAddNote}
      onEditingTextChange={setEditingText}
      onEditNote={handleEditNote}
      onEditStart={(index, note) => {
        setEditingIndex(index);
        setEditingText(note);
      }}
      onEditCancel={() => setEditingIndex(null)}
      onDeleteNote={handleRemoveNote}
      onTodosChange={handleTodosChange}
    />
  );
}