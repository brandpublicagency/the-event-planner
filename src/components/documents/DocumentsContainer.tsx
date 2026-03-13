
import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { DocumentsSidebar } from "./DocumentsSidebar";
import DocumentEditor from "@/components/documents/DocumentEditor";
import { DocumentCreatingState } from "./DocumentCreatingState";
import { DocumentsErrorState } from "./DocumentsErrorState";
import { useDocumentsData } from "@/hooks/useDocumentsData";
import { useDocumentSelection } from "@/hooks/useDocumentSelection";

interface DocumentsContainerProps {
  autoCreateDocument?: boolean;
  initialDocId?: string | null;
}

export function DocumentsContainer({ autoCreateDocument = false, initialDocId = null }: DocumentsContainerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [documentCreated, setDocumentCreated] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarCollapsed(prev => !prev), []);

  const {
    documents,
    isLoading,
    error,
    createDocument,
    isCreatingDocument
  } = useDocumentsData();

  const { selectedDocId, setSelectedDocId } = useDocumentSelection(
    documents,
    autoCreateDocument,
    documentCreated
  );

  useEffect(() => {
    return () => {
      setDocumentCreated(false);
    };
  }, []);

  useEffect(() => {
    if (!autoCreateDocument) {
      setDocumentCreated(false);
    }
  }, [autoCreateDocument]);

  useEffect(() => {
    if (autoCreateDocument && !documentCreated && !isCreatingDocument && !createDocument.isPending && !isLoading) {
      handleNewDocument();
    }
  }, [autoCreateDocument, documentCreated, createDocument.isPending, isLoading, isCreatingDocument]);

  const handleNewDocument = () => {
    createDocument.mutate(undefined, {
      onSuccess: (newDoc) => {
        setSelectedDocId(newDoc.id);
        setDocumentCreated(true);
      }
    });
  };

  if (error) {
    return <DocumentsErrorState error={error} />;
  }

  return (
    <div className="flex flex-col h-screen">
      <Header pageTitle="Documents" />

      <div className="flex flex-1 overflow-hidden">
        <DocumentsSidebar
          documents={documents || []}
          isLoading={isLoading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          selectedDocId={selectedDocId}
          setSelectedDocId={setSelectedDocId}
          handleNewDocument={handleNewDocument}
          createDocumentPending={createDocument.isPending || isCreatingDocument}
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
        />

        <div className="flex-1 h-full overflow-hidden bg-background">
          {createDocument.isPending || isCreatingDocument ? (
            <DocumentCreatingState />
          ) : (
            <DocumentEditor
              documentId={selectedDocId}
              key={selectedDocId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
