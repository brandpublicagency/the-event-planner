
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import DocumentEditor from "@/components/documents/DocumentEditor";
import { DocumentCreatingState } from "./DocumentCreatingState";

interface DocumentsContainerProps {
  initialDocId?: string | null;
}

export function DocumentsContainer({ initialDocId = null }: DocumentsContainerProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen">
      <Header pageTitle="Documents">
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={() => navigate("/documents")}>
          <ArrowLeft className="h-4 w-4" />
          Library
        </Button>
      </Header>

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
