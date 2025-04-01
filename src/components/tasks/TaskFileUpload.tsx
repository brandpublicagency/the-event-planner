import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, Upload } from "lucide-react";
import { useFileOperations } from "@/hooks/useFileOperations";
import { Progress } from "@/components/ui/progress";

interface TaskFileUploadProps {
  taskId: string;
  onSuccess?: () => void;
}

export function TaskFileUpload({ taskId, onSuccess }: TaskFileUploadProps) {
  const { uploadFile, isLoading, progress } = useFileOperations();
  const [showProgress, setShowProgress] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setShowProgress(true);
      await uploadFile(file, taskId);
      if (onSuccess) {
        onSuccess();
      }
    } finally {
      e.target.value = ''; // Reset input after upload
      // Keep progress visible for a moment so user can see it completed
      setTimeout(() => setShowProgress(false), 2000);
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
      {showProgress && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2 w-full" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading... {progress}%</span>
              </>
            ) : (
              <span>Upload complete</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
