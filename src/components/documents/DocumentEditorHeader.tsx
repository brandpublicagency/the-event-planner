
import { useState } from "react";
import { DocumentTitle } from "./DocumentTitle";
import { DocumentActions } from "./DocumentActions";
import { CategorySelector } from "./CategorySelector";
import { getDocumentCategories, updateDocumentCategories } from "@/api/supabaseApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Document } from "@/types/document";
import { DocumentDeleteDialog } from "./DocumentDeleteDialog";
import { useNavigate } from "react-router-dom";

interface DocumentEditorHeaderProps {
  document: Document;
  content?: string;
  printRef?: React.RefObject<HTMLDivElement>;
  onTitleChange?: (title: string) => void;
}

export default function DocumentEditorHeader({
  document,
  content,
  printRef,
  onTitleChange
}: DocumentEditorHeaderProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: categories = [] } = useQuery({
    queryKey: ["document-categories", document.id],
    queryFn: () => getDocumentCategories(document.id),
    enabled: !!document.id,
  });
  
  const updateCategories = useMutation({
    mutationFn: (categoryIds: string[]) => 
      updateDocumentCategories(document.id, categoryIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["document-categories", document.id] 
      });
    }
  });
  
  const handleCategoryChange = (categoryId: string | null) => {
    if (!document.id) return;
    
    const currentCategoryIds = document.category_ids || [];
    
    if (categoryId === null) {
      // Remove all categories
      updateCategories.mutate([]);
    } else if (currentCategoryIds.includes(categoryId)) {
      // Remove category
      updateCategories.mutate(
        currentCategoryIds.filter(id => id !== categoryId)
      );
    } else {
      // Add category
      updateCategories.mutate([...currentCategoryIds, categoryId]);
    }
  };

  const handleDeleteConfirmed = () => {
    console.log("Document deleted, navigating to documents page");
    navigate("/documents");
  };
  
  return (
    <div className="flex items-center justify-between border-b p-4">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <DocumentTitle 
          title={document.title} 
          onChange={onTitleChange}
        />
        
        <div className="hidden sm:flex">
          <CategorySelector 
            selectedCategories={document.category_ids || []}
            onChange={handleCategoryChange}
            multiSelect={true}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <DocumentActions 
          document={document}
          content={content}
          printRef={printRef}
          onDelete={() => setIsDeleteDialogOpen(true)}
        />
        
        <DocumentDeleteDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          documentId={document.id}
          documentTitle={document.title}
          onDocumentDeleted={handleDeleteConfirmed}
        />
      </div>
    </div>
  );
}
