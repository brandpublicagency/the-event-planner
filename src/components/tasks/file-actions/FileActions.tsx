
import { Eye, Loader2 } from "lucide-react";
import { FileActionButton } from "./FileActionButton";
import { FileDeleteDialog } from "./FileDeleteDialog";
import { useFileOperations } from "@/hooks/useFileOperations";
import { useState } from "react";

interface FileActionsProps {
  file: {
    id: string;
    task_id: string;
    file_name: string;
    file_path: string;
    content_type: string;
  };
}

export function FileActions({ file }: FileActionsProps) {
  const { viewFile, deleteFile } = useFileOperations();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isViewLoading, setIsViewLoading] = useState(false);

  const handleView = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsViewLoading(true);
      // Log content type to help with debugging
      console.log("Viewing file with content type:", file.content_type);
      await viewFile(file.file_path, file.content_type);
    } catch (error) {
      console.error("Error viewing file:", error);
    } finally {
      setIsViewLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      console.log("Starting delete operation for file:", file);
      await deleteFile(file.file_path, file.id, file.task_id);
      console.log("Delete operation completed successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
      <FileActionButton
        icon={isViewLoading ? Loader2 : Eye}
        onClick={handleView}
        disabled={isViewLoading || isDeleting}
        className={isViewLoading ? "animate-spin" : ""}
        variant="ghost"
      />
      <FileDeleteDialog
        isDeleting={isDeleting}
        onDelete={handleDelete}
        disabled={isViewLoading || isDeleting}
      />
    </div>
  );
}
