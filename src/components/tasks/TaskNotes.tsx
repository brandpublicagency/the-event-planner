import { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface TaskNotesProps {
  taskId: string;
}

export function TaskNotes({ taskId }: TaskNotesProps) {
  const [newNote, setNewNote] = useState("");
  const { tasks, updateTask } = useTaskContext();
  const queryClient = useQueryClient();
  
  // Get the current task's notes
  const currentTask = tasks.find(task => task.id === taskId);
  const notes = currentTask?.notes || [];

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    try {
      const updatedNotes = [...notes, newNote];
      await updateTask(taskId, { notes: updatedNotes });
      setNewNote("");
      // Invalidate the tasks query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Note added successfully");
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note");
    }
  };

  const handleRemoveNote = async (index: number) => {
    try {
      const updatedNotes = notes.filter((_, i) => i !== index);
      await updateTask(taskId, { notes: updatedNotes });
      // Invalidate the tasks query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Note removed successfully");
    } catch (error) {
      console.error("Error removing note:", error);
      toast.error("Failed to remove note");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Input
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddNote();
            }
          }}
        />
        <Button 
          onClick={handleAddNote} 
          disabled={!newNote.trim()}
          size="icon"
          className="h-8 w-8 rounded-full"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {Array.isArray(notes) && notes.length > 0 ? (
          notes.map((note, index) => (
            <div key={index} className="flex items-center justify-between gap-2 p-2 bg-accent rounded-md">
              <span className="text-sm">{note}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleRemoveNote(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-2">
            No notes added yet
          </p>
        )}
      </div>
    </div>
  );
}