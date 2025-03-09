
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DocumentsHeader } from "./DocumentsHeader";
import { DocumentsSidebar } from "./DocumentsSidebar";
import DocumentEditor from "@/components/documents/DocumentEditor";
import { Card } from "@/components/ui/card";
import type { Document } from "@/types/document";

interface DocumentsContainerProps {
  autoCreateDocument?: boolean;
}

export function DocumentsContainer({ autoCreateDocument = false }: DocumentsContainerProps) {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [documentCreated, setDocumentCreated] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents, isLoading, error } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      console.log("Fetching documents list");
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        throw new Error("Authentication required");
      }

      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading documents:", error);
        toast({
          title: "Error loading documents",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      console.log("Documents fetched successfully:", data);
      return data as Document[];
    },
    retry: 1,
  });

  useEffect(() => {
    if (documents && selectedDocId) {
      const selectedDocExists = documents.some(doc => doc.id === selectedDocId);
      if (!selectedDocExists) {
        setSelectedDocId(null);
      }
    }
  }, [documents, selectedDocId]);

  const createDocument = useMutation({
    mutationFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        throw new Error("Authentication required");
      }

      console.log("Creating new document");
      const { data, error } = await supabase
        .from("documents")
        .insert({
          title: "Untitled Document",
          content: { type: "doc", html: "", text: "" },
          user_id: session.session.user.id,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating document:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      console.log("New document created:", data);
      return data as Document;
    },
    onSuccess: (newDoc) => {
      console.log("Document created successfully, selecting document ID:", newDoc.id);
      setSelectedDocId(newDoc.id);
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast({
        title: "Success",
        description: "New document created",
      });
      setDocumentCreated(true);
    },
    onError: (error: Error) => {
      console.error("Error creating document:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create a new document automatically when autoCreateDocument is true
  useEffect(() => {
    if (autoCreateDocument && !documentCreated && !createDocument.isPending && !isLoading) {
      console.log("Auto-creating document");
      handleNewDocument();
    }
  }, [autoCreateDocument, documentCreated, createDocument.isPending, isLoading]);

  const handleNewDocument = () => {
    createDocument.mutate();
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md p-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">Error loading documents</h2>
            <p className="text-muted-foreground">{error.message}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <DocumentsHeader />
      
      <div className="flex flex-1 h-0 overflow-hidden">
        <DocumentsSidebar 
          documents={documents}
          isLoading={isLoading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          selectedDocId={selectedDocId}
          setSelectedDocId={setSelectedDocId}
          handleNewDocument={handleNewDocument}
          createDocumentPending={createDocument.isPending}
        />

        <div className="flex-1 h-full overflow-auto bg-gray-50">
          <DocumentEditor documentId={selectedDocId} />
        </div>
      </div>
    </div>
  );
}
