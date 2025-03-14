
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import { exportAsPdf, exportAsDocx } from "@/utils/exportUtils";
import { DocumentDeleteDialog } from "./DocumentDeleteDialog";

interface DocumentActionsProps {
  documentId: string;
  title: string;
  content: string;
}

export default function DocumentActions({ documentId, title, content }: DocumentActionsProps) {
  const handleExport = async (format: 'pdf' | 'docx') => {
    try {
      if (format === 'pdf') {
        await exportAsPdf(title, content);
      } else {
        await exportAsDocx(title, content);
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleExport('pdf')}>
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport('docx')}>
            Export as DOCX
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DocumentDeleteDialog documentId={documentId} documentTitle={title} />
    </div>
  );
}
