import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DocumentList from "@/components/documents/DocumentList";
import DocumentEditor from "@/components/documents/DocumentEditor";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function Documents() {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: documents, isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error loading documents",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      return data;
    },
  });

  const filteredDocuments = documents?.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full">
      {/* Sidebar */}
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
          <Button className="w-full" size="sm">
            <Plus className="h-4 w-4 mr-2" />
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
              documents={filteredDocuments || []}
              selectedId={selectedDocId}
              onSelect={setSelectedDocId}
            />
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 h-full overflow-auto">
        <DocumentEditor documentId={selectedDocId} />
      </div>
    </div>
  );
}