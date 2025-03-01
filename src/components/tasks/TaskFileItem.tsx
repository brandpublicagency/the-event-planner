
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
      <div className="flex items-center gap-2 min-w-0 max-w-[70%]">
        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="text-sm font-medium truncate" title={file.file_name}>
          {file.file_name}
        </span>
      </div>
      <FileActions file={file} />
    </div>
  );
};
