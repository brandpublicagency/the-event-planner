import { Upload } from "lucide-react";

interface DocumentUploadProps {
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
}

const DocumentUpload = ({ handleFileUpload, uploading }: DocumentUploadProps) => {
  return (
    <div className="mt-8">
      <h4 className="text-lg font-medium mb-4">Documents</h4>
      <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
        <label className="flex flex-col items-center cursor-pointer">
          <Upload className="h-8 w-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">Upload PDFs (max 3)</span>
          <input
            type="file"
            multiple
            accept=".pdf"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  );
};

export default DocumentUpload;