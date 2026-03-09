
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DocumentList from "@/components/documents/DocumentList";
import { Loader2, Plus, FileText, Search } from "lucide-react";
import type { Document } from "@/types/document";

interface DocumentsSidebarProps {
  documents: Document[] | undefined;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
  selectedDocId: string | null;
  setSelectedDocId: (id: string) => void;
  handleNewDocument: () => void;
  createDocumentPending: boolean;
}

export function DocumentsSidebar({
  documents,
  isLoading,
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  selectedDocId,
  setSelectedDocId,
  handleNewDocument,
  createDocumentPending
}: DocumentsSidebarProps) {
  const searchFilteredDocuments = documents?.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredDocuments = categoryFilter && categoryFilter !== 'all'
    ? searchFilteredDocuments.filter(doc => doc.category_ids && doc.category_ids.includes(categoryFilter))
    : searchFilteredDocuments;

  return (
    <div className="w-64 border-r border-border bg-muted/30 flex flex-col h-full">
      {/* Header with new doc button */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Documents</span>
        <Button
          onClick={handleNewDocument}
          disabled={createDocumentPending}
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
        >
          {createDocumentPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>

      {/* Search */}
      <div className="px-2 py-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="h-7 pl-7 text-xs bg-background border-border"
          />
        </div>
      </div>

      {/* Document list */}
      <div className="flex-1 overflow-auto px-2 pb-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <FileText className="h-8 w-8 text-muted-foreground/30 mb-2" />
            <p className="text-xs text-muted-foreground">
              {searchQuery ? "No results" : "No documents yet"}
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
    </div>
  );
}
