import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUp } from "lucide-react";

interface DocumentUploadProps {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const DocumentUpload = ({ onUpload }: DocumentUploadProps) => {
  return (
    <>
      <Input
        type="file"
        accept=".pdf"
        onChange={onUpload}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <Button asChild>
          <span className="cursor-pointer">
            <FileUp className="mr-2 h-4 w-4" />
            Upload
          </span>
        </Button>
      </label>
    </>
  );
};