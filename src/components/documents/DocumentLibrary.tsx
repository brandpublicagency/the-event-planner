
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { useDocumentsData } from "@/hooks/useDocumentsData";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DocumentDeleteDialog } from "./DocumentDeleteDialog";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, FileText, Search, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Document } from "@/types/document";

export function DocumentLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { documents, isLoading, createDocument, isCreatingDocument } = useDocumentsData();
  const { categories } = useCategories();

  const filtered = (documents || []).filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewDocument = () => {
    createDocument.mutate(undefined, {
      onSuccess: (newDoc) => {
        navigate(`/documents/${newDoc.id}`);
      }
    });
  };

  const getCategoryName = (id: string) => {
    const cat = categories.find(c => c.id === id);
    return cat?.name;
  };

  const getCategoryColor = (id: string) => {
    const cat = categories.find(c => c.id === id);
    return cat?.color;
  };

  return (
    <div className="flex flex-col h-screen">
      <Header pageTitle="Documents" />

      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-10">
          {/* Title row */}
          <div className="flex items-center gap-3 mb-1">
            <FileText className="h-8 w-8 text-muted-foreground/60" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Documents</h1>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between mt-6 mb-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
              <input
                type="text"
                placeholder="Search…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-8 w-56 rounded-md border border-border/60 bg-transparent pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
              />
            </div>
            <Button
              onClick={handleNewDocument}
              disabled={createDocument.isPending || isCreatingDocument}
              size="sm"
              className="gap-1.5 rounded-md font-medium"
            >
              {createDocument.isPending || isCreatingDocument ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              New
            </Button>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FileText className="h-10 w-10 text-muted-foreground/15 mb-3" />
              <p className="text-sm text-muted-foreground/60">
                {searchQuery ? "No documents found" : "No documents yet. Create your first one."}
              </p>
            </div>
          ) : (
            <div className="border border-border/60 rounded-lg overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_140px_140px_120px] bg-muted/30 border-b border-border/40 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
                <div className="px-4 py-2.5">Name</div>
                <div className="px-4 py-2.5">Created</div>
                <div className="px-4 py-2.5">Updated</div>
                <div className="px-4 py-2.5">Category</div>
              </div>

              {/* Table rows */}
              {filtered.map((doc, idx) => (
                <DocumentRow
                  key={doc.id}
                  doc={doc}
                  isLast={idx === filtered.length - 1}
                  getCategoryName={getCategoryName}
                  getCategoryColor={getCategoryColor}
                  onClick={() => navigate(`/documents/${doc.id}`)}
                  onDeleted={() => queryClient.invalidateQueries({ queryKey: ["documents"] })}
                />
              ))}

              {/* New page row */}
              <button
                onClick={handleNewDocument}
                disabled={createDocument.isPending || isCreatingDocument}
                className="w-full grid grid-cols-[1fr_140px_140px_120px] text-left hover:bg-muted/20 transition-colors group"
              >
                <div className="px-4 py-2.5 flex items-center gap-2 text-sm text-muted-foreground/50 group-hover:text-muted-foreground transition-colors">
                  {createDocument.isPending || isCreatingDocument ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                  New page
                </div>
                <div />
                <div />
                <div />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DocumentRow({
  doc,
  isLast,
  getCategoryName,
  getCategoryColor,
  onClick,
  onDeleted
}: {
  doc: Document;
  isLast: boolean;
  getCategoryName: (id: string) => string | undefined;
  getCategoryColor: (id: string) => string | undefined;
  onClick: () => void;
  onDeleted: () => void;
}) {
  const firstCategory = doc.category_ids?.[0];
  const categoryName = firstCategory ? getCategoryName(firstCategory) : undefined;
  const categoryColor = firstCategory ? getCategoryColor(firstCategory) : undefined;

  return (
    <div
      className={cn(
        "group grid grid-cols-[1fr_140px_140px_120px] cursor-pointer hover:bg-muted/20 transition-colors relative",
        !isLast && "border-b border-border/30"
      )}
      onClick={onClick}
    >
      <div className="px-4 py-2.5 flex items-center gap-2.5 min-w-0">
        <FileText className="h-4 w-4 shrink-0 text-muted-foreground/40" />
        <span className="text-sm text-foreground truncate">{doc.title || "Untitled"}</span>
      </div>
      <div className="px-4 py-2.5 text-sm text-muted-foreground/60">
        {format(new Date(doc.created_at), "MMM d, yyyy")}
      </div>
      <div className="px-4 py-2.5 text-sm text-muted-foreground/60">
        {format(new Date(doc.updated_at), "MMM d, yyyy")}
      </div>
      <div className="px-4 py-2.5 flex items-center">
        {categoryName ? (
          <Badge
            variant="outline"
            className="text-[11px] px-2 py-0.5 rounded-sm font-normal border-border/40"
            style={categoryColor ? {
              backgroundColor: `${categoryColor}20`,
              borderColor: `${categoryColor}40`,
              color: categoryColor
            } : undefined}
          >
            {categoryName}
          </Badge>
        ) : (
          <span className="text-sm text-muted-foreground/30">—</span>
        )}
      </div>

      {/* Delete action on hover */}
      <div
        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={e => e.stopPropagation()}
      >
        <DocumentDeleteDialog
          documentId={doc.id}
          documentTitle={doc.title || "Untitled"}
          isButton={false}
          onDocumentDeleted={onDeleted}
        />
      </div>
    </div>
  );
}
