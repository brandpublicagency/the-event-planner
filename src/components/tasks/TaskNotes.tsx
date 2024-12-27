import { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

interface TaskNotesProps {
  taskId: string;
  notes?: string[];
}

export function TaskNotes({ taskId, notes = [] }: TaskNotesProps) {
  const [newNote, setNewNote] = useState("");
  const { updateTask } = useTaskContext();

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    const updatedNotes = [...(notes || []), newNote];
    await updateTask(taskId, { notes: updatedNotes });
    setNewNote("");
  };

  const handleRemoveNote = async (index: number) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    await updateTask(taskId, { notes: updatedNotes });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
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
        <Button onClick={handleAddNote}>Add</Button>
      </div>
      
      <div className="space-y-2">
        {notes.map((note, index) => (
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
        ))}
      </div>
    </div>
  );
}