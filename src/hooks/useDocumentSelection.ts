
import { useState, useEffect } from "react";
import type { Document } from "@/types/document";

export function useDocumentSelection(documents: Document[] | undefined, autoCreateDocument: boolean, documentCreated: boolean) {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  
  // Reset document created when component unmounts
  useEffect(() => {
    return () => {
      // This is handled by the parent component now
    };
  }, []);

  // Ensure selected document still exists in list
  useEffect(() => {
    if (documents && selectedDocId) {
      const selectedDocExists = documents.some(doc => doc.id === selectedDocId);
      if (!selectedDocExists) {
        setSelectedDocId(null);
      }
    }
  }, [documents, selectedDocId]);

  return {
    selectedDocId,
    setSelectedDocId
  };
}
