import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, Upload } from "lucide-react";
import { useFileOperations } from "@/hooks/useFileOperations";

interface TaskFileUploadProps {
  taskId: string;
  onSuccess?: () => void;
}

export function TaskFileUpload({ taskId, onSuccess }: TaskFileUploadProps) {
  const { uploadFile, isLoading } = useFileOperations();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadFile(file, taskId);
      if (onSuccess) {
        onSuccess();
      }
    } finally {
      e.target.value = ''; // Reset input after upload
    }
  };

  return (
    <div className="space-y-2">
      <Input
        type="file"
        onChange={handleFileChange}
        disabled={isLoading}
        className="cursor-pointer"
      />
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Uploading...</span>
        </div>
      )}
    </div>
  );
}