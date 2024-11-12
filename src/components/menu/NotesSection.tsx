import { Textarea } from "@/components/ui/textarea";

interface NotesSectionProps {
  notes: string;
  onChange: (value: string) => void;
}

const NotesSection = ({ notes, onChange }: NotesSectionProps) => {
  return (
    <div className="space-y-2 print:break-inside-avoid">
      <label className="text-sm font-medium text-zinc-700">Additional Notes</label>
      <Textarea 
        className="w-full min-h-[120px] transition-all duration-200 focus:ring-2 focus:ring-zinc-200" 
        placeholder="Additional notes, dietary requirements, allergies, or special instructions..."
        value={notes}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default NotesSection;