
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { useDocumentsData } from "@/hooks/useDocumentsData";
import { useCategories } from "@/hooks/useCategories";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DocumentDeleteDialog } from "./DocumentDeleteDialog";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, FileText, Search } from "lucide-react";
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

      <div className="flex-1 overflow-auto p-6">
        {/* Top bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Button
            onClick={handleNewDocument}
            disabled={createDocument.isPending || isCreatingDocument}
            size="sm"
            className="gap-1.5"
          >
            {createDocument.isPending || isCreatingDocument ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            New Document
          </Button>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="h-10 w-10 text-muted-foreground/20 mb-3" />
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "No documents found" : "No documents yet. Create your first one."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(doc => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                getCategoryName={getCategoryName}
                getCategoryColor={getCategoryColor}
                onClick={() => navigate(`/documents/${doc.id}`)}
                onDeleted={() => queryClient.invalidateQueries({ queryKey: ["documents"] })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DocumentCard({
  doc,
  getCategoryName,
  getCategoryColor,
  onClick,
  onDeleted
}: {
  doc: Document;
  getCategoryName: (id: string) => string | undefined;
  getCategoryColor: (id: string) => string | undefined;
  onClick: () => void;
  onDeleted: () => void;
}) {
  return (
    <Card
      className="group relative cursor-pointer hover:shadow-md transition-shadow p-4 flex flex-col gap-3"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center shrink-0">
          <FileText className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{doc.title || "Untitled"}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {format(new Date(doc.updated_at), "MMM d, yyyy")}
          </p>
        </div>
      </div>

      {doc.category_ids && doc.category_ids.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {doc.category_ids.slice(0, 3).map(id => {
            const name = getCategoryName(id);
            const color = getCategoryColor(id);
            return name ? (
              <Badge
                key={id}
                variant="outline"
                className="text-[10px] px-1.5 py-0 rounded-full"
                style={color ? { backgroundColor: color, borderColor: color } : undefined}
              >
                {name}
              </Badge>
            ) : null;
          })}
        </div>
      )}

      <div
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={e => e.stopPropagation()}
      >
        <DocumentDeleteDialog
          documentId={doc.id}
          documentTitle={doc.title || "Untitled"}
          isButton={false}
          onDocumentDeleted={onDeleted}
        />
      </div>
    </Card>
  );
}
