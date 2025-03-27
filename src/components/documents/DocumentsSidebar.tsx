
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CategorySelector } from "@/components/documents/CategorySelector";
import DocumentList from "@/components/documents/DocumentList";
import { Loader2, Tag, Search } from "lucide-react";
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
  // Filter documents based on search query and category
  const searchFilteredDocuments = documents?.filter(doc => doc.title.toLowerCase().includes(searchQuery.toLowerCase())) || [];
  const filteredDocuments = categoryFilter && categoryFilter !== 'all' ? searchFilteredDocuments.filter(doc => doc.category_ids && doc.category_ids.includes(categoryFilter)) : searchFilteredDocuments;
  
  return (
    <Card className="w-72 border-r rounded-none border-l-0 border-t-0 border-b-0 bg-white p-0 flex flex-col h-full overflow-hidden">
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
            <Input placeholder="Search documents..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-9 pl-9 pr-4 w-full" />
          </div>
          <CategorySelector selectedCategory={categoryFilter} onChange={setCategoryFilter} includeAllOption={true} placeholder="Filter by category" />
        </div>
      </div>
    </Card>
  );
}
