import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import DocumentList from "@/components/documents/DocumentList";
import DocumentEditor from "@/components/documents/DocumentEditor";
import { useState } from "react";
import type { Document } from "@/types/document";

export default function Documents() {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents, isLoading, error } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      console.log("Fetching documents list");
      
      // First verify auth status
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading documents:", error);
        throw error;
      }

      console.log("Documents fetched successfully:", data);
      return data as Document[];
    },
    retry: 1,
    onError: (error: Error) => {
      console.error("Query error:", error);
      toast({
        title: "Error loading documents",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createDocument = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      console.log("Creating new document");
      const { data, error } = await supabase
        .from("documents")
        .insert({
          title: "Untitled Document",
          content: { type: "doc", html: "", text: "" },
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating document:", error);
        throw error;
      }
      
      console.log("New document created:", data);
      return data as Document;
    },
    onSuccess: (newDoc) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      setSelectedDocId(newDoc.id);
      toast({
        title: "Success",
        description: "New document created",
      });
    },
    onError: (error: Error) => {
      console.error("Error creating document:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create document",
        variant: "destructive",
      });
    },
  });

  const handleNewDocument = () => {
    createDocument.mutate();
  };

  const filteredDocuments = documents?.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Error loading documents</h2>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="w-64 border-r bg-white p-4 flex flex-col h-full">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
            />
            <Button size="sm" className="h-9">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            className="w-full" 
            size="sm"
            onClick={handleNewDocument}
            disabled={createDocument.isPending}
          >
            {createDocument.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            New Document
          </Button>
        </div>
        
        <div className="mt-4 flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <DocumentList
              documents={filteredDocuments}
              selectedId={selectedDocId}
              onSelect={setSelectedDocId}
            />
          )}
        </div>
      </div>

      <div className="flex-1 h-full overflow-auto">
        <DocumentEditor documentId={selectedDocId} />
      </div>
    </div>
  );
}