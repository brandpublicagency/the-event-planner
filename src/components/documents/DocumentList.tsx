import { cn } from "@/lib/utils";

interface Document {
  id: string;
  title: string;
  created_at: string;
}

interface DocumentListProps {
  documents: Document[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function DocumentList({ documents, selectedId, onSelect }: DocumentListProps) {
  return (
    <div className="space-y-1">
      {documents.map((doc) => (
        <button
          key={doc.id}
          onClick={() => onSelect(doc.id)}
          className={cn(
            "w-full text-left px-2 py-1.5 rounded-md text-sm",
            "hover:bg-accent hover:text-accent-foreground",
            selectedId === doc.id && "bg-accent text-accent-foreground"
          )}
        >
          {doc.title || "Untitled"}
        </button>
      ))}
      {documents.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No documents found
        </p>
      )}
    </div>
  );
}