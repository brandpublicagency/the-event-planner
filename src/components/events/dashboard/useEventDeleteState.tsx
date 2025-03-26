
import { useState } from "react";

export const useEventDeleteState = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  return {
    isDeleting,
    setIsDeleting,
    isPermanentDelete,
    setIsPermanentDelete,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen
  };
};
