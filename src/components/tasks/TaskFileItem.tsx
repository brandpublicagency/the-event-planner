import { FileText } from "lucide-react";
import { FileActions } from "./file-actions/FileActions";

interface TaskFile {
  id: string;
  task_id: string;
  file_name: string;
  file_path: string;
  content_type: string;
}

interface TaskFileItemProps {
  file: TaskFile;
}

export const TaskFileItem = ({ file }: TaskFileItemProps) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg border bg-card">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{file.file_name}</span>
      </div>
      <FileActions file={file} />
    </div>
  );
};