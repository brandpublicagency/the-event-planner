import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Tag, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DocumentList from "@/components/documents/DocumentList";
import DocumentEditor from "@/components/documents/DocumentEditor";
import { useState, useEffect } from "react";
import { CategorySelector } from "@/components/documents/CategorySelector";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Document } from "@/types/document";

export default function Documents() {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
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
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleNewDocument = () => {
    createDocument.mutate();
  };

  const searchFilteredDocuments = documents?.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredDocuments = categoryFilter && categoryFilter !== 'all'
    ? searchFilteredDocuments.filter(doc => 
        doc.category_ids && 
        doc.category_ids.includes(categoryFilter)
      )
    : searchFilteredDocuments;

  const totalDocuments = documents?.length || 0;
  const filteredCount = filteredDocuments.length;

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
      <Header pageTitle="Documents">
        <div className="flex-1 flex items-center justify-end gap-4 ml-6">
          {!isLoading && filteredDocuments.length > 0 && (
            <div className="hidden md:flex items-center gap-2">
              <Badge variant="outline" className="bg-white">
                {filteredCount} {filteredCount === 1 ? 'document' : 'documents'}
                {filteredCount !== totalDocuments && ` (filtered from ${totalDocuments})`}
              </Badge>
            </div>
          )}
        </div>
      </Header>
      
      <div className="flex flex-1 h-0 overflow-hidden">
        <Card className="w-72 border-r rounded-none border-l-0 border-t-0 border-b-0 bg-white p-0 flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b">
            <Button 
              onClick={handleNewDocument} 
              className="w-full flex items-center gap-1 shadow-sm"
              disabled={createDocument.isPending}
            >
              {createDocument.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              New Document
            </Button>
          </div>
          
          <div className="flex-1 overflow-auto p-3">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <Tag className="h-10 w-10 text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground mb-1">No documents found</p>
                <p className="text-xs text-muted-foreground/60">
                  {searchQuery ? "Try a different search term" : "Create your first document to get started"}
                </p>
              </div>
            ) : (
              <DocumentList
                documents={filteredDocuments}
                selectedId={selectedDocId}
                onSelect={setSelectedDocId}
                categoryFilter={categoryFilter}
              />
            )}
          </div>
          
          <div className="p-3 border-t bg-gray-50">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-9 pr-4 w-full"
                />
              </div>
              <CategorySelector 
                selectedCategory={categoryFilter}
                onChange={setCategoryFilter}
                includeAllOption={true}
                placeholder="Filter by category"
              />
            </div>
          </div>
        </Card>

        <div className="flex-1 h-full overflow-auto bg-gray-50">
          <DocumentEditor documentId={selectedDocId} />
        </div>
      </div>
    </div>
  );
}
