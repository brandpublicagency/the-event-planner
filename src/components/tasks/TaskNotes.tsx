import { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Loader2, X } from "lucide-react";

export function TaskNotes({ taskId }: { taskId: string }) {
  const [newNote, setNewNote] = useState("");
  const { tasks, updateTask } = useTaskContext();
  const task = tasks.find((t) => t.id === taskId);

  const handleAddNote = async () => {
    if (!newNote.trim() || !task) return;
    const updatedNotes = [...(task.notes || []), newNote];
    await updateTask(taskId, { notes: updatedNotes });
    setNewNote("");
  };

  const handleRemoveNote = async (index: number) => {
    if (!task) return;
    const updatedNotes = task.notes?.filter((_, i) => i !== index);
    await updateTask(taskId, { notes: updatedNotes });
  };

  if (!task) return null;

  return (
    <div className="space-y-4">
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
        />
        <Button onClick={handleAddNote} disabled={!newNote.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {task.notes?.map((note, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 rounded-lg border group"
          >
            <div className="flex items-center gap-2">
              <Checkbox />
              <span className="text-sm">{note}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
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
  );
}