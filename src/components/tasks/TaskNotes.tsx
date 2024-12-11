import { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { TodoList } from "./TodoList";
import { useToast } from "@/components/ui/use-toast";

export function TaskNotes({ taskId }: { taskId: string }) {
  const { toast } = useToast();
  const [newNote, setNewNote] = useState("");
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
        <div className="flex gap-2">
          <Input
            placeholder="Add a note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddNote();
              }
            }}
            className="h-10 text-sm"
          />
          <Button 
            onClick={handleAddNote} 
            disabled={!newNote.trim()}
            size="icon"
            className="shrink-0 h-10 w-10"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {task.notes?.map((note, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 px-3 rounded-lg border group hover:bg-accent/50 transition-colors"
            >
              <span className="text-sm">{note}</span>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                onClick={() => handleRemoveNote(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
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
      <TodoList 
        todos={task.todos || []}
        onTodosChange={handleTodosChange}
      />
    </div>
  );
}