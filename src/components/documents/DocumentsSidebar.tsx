
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
    <div className="w-60 border-r border-border bg-muted/20 flex flex-col h-full">
      {/* Search + New button row */}
      <div className="px-3 pt-3 pb-2 space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-xs bg-background/80 border-border/60 rounded-md"
          />
        </div>
      </div>

      {/* Document list */}
      <div className="flex-1 overflow-auto px-2 pb-2">
        <div className="flex items-center justify-between px-1 pb-1.5">
          <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-widest">All documents</span>
          <Button
            onClick={handleNewDocument}
            disabled={createDocumentPending}
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
          >
            {createDocumentPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Plus className="h-3 w-3" />
            )}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <FileText className="h-6 w-6 text-muted-foreground/20 mb-2" />
            <p className="text-[11px] text-muted-foreground/60">
              {searchQuery ? "No results found" : "No documents yet"}
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
