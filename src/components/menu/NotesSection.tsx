import React from 'react';
import { Textarea } from "@/components/ui/textarea";

interface NotesSectionProps {
  notes: string;
  onChange: (value: string) => void;
}

const NotesSection = ({ notes, onChange }: NotesSectionProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-700">Additional Notes</label>
      <Textarea
        placeholder="Add any special requirements or notes here..."
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[100px]"
      />
    </div>
  );
};

export default NotesSection;