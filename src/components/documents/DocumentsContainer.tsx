
import DocumentEditor from "@/components/documents/DocumentEditor";
import { DocumentCreatingState } from "./DocumentCreatingState";

interface DocumentsContainerProps {
  initialDocId?: string | null;
}

export function DocumentsContainer({ initialDocId = null }: DocumentsContainerProps) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-hidden bg-background">
        {initialDocId ? (
          <DocumentEditor
            documentId={initialDocId}
            key={initialDocId}
          />
        ) : (
          <DocumentCreatingState />
        )}
      </div>
    </div>
  );
}
