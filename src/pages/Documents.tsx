
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, Plus, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DocumentList from "@/components/documents/DocumentList";
import DocumentEditor from "@/components/documents/DocumentEditor";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import { CategoryBadge } from "@/components/documents/CategoryBadge";
import type { Document } from "@/types/document";

export default function Documents() {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { categories, isLoadingCategories } = useCategories();

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

  // Clear selected document id if the document is not available after filtering
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

  const filteredDocuments = documents?.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleClearFilter = () => {
    setCategoryFilter(null);
  };

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
          
          <div className="flex items-center gap-2">
            <Select value={categoryFilter || "all"} onValueChange={(value) => setCategoryFilter(value === "all" ? null : value)}>
              <SelectTrigger className="h-9 flex-1">
                <div className="flex items-center">
                  <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Filter by category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Documents</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center">
                      <div 
                        className="w-2 h-2 rounded-full mr-2" 
                        style={{ backgroundColor: category.color || '#888' }}
                      ></div>
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {categoryFilter && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 flex-shrink-0" 
                onClick={handleClearFilter}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {categoryFilter && categories.find(c => c.id === categoryFilter) && (
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">Filtered by:</span>
              <CategoryBadge 
                category={categories.find(c => c.id === categoryFilter)!}
                selected={true}
                showClose={true}
                onRemove={handleClearFilter}
              />
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              className="flex-1" 
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
              categoryFilter={categoryFilter}
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
