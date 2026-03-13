
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Download, Printer, Trash2
} from "lucide-react";
import { useReactToPrint } from 'react-to-print';
import { Document } from '@/types/document';
import { exportDocument } from '@/utils/documentUtils';
import { exportAsPdf, exportAsDocx } from '@/utils/exportUtils';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface DocumentActionsProps {
  document: Document;
  content?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  printRef?: React.RefObject<HTMLDivElement>;
}

export function DocumentActions({ 
  document, 
  content, 
  onDelete,
  printRef 
}: DocumentActionsProps) {
  // Configure the print function with proper typing
  const handlePrint = useReactToPrint({
    documentTitle: document.title,
    onBeforePrint: () => {
      console.log('Printing document:', document.title);
      return Promise.resolve();
    },
    // Only provide content if printRef is defined
    ...(printRef && { content: () => printRef.current })
  });

  const handleExport = () => {
    if (content) {
      exportDocument(content, document.title);
    }
  };

  const handleExportAsPdf = () => {
    if (content) {
      exportAsPdf(content, document.title);
    }
  };

  const handleExportAsDocx = () => {
    if (content) {
      exportAsDocx(content, document.title);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      {printRef && (
        <Button 
          size="default" 
          variant="outline" 
          onClick={() => {
            if (printRef.current) {
              handlePrint();
            } else {
              console.warn("Print reference is not available");
            }
          }} 
          className="p-2 h-9 w-9"
        >
          <Printer className="h-3.5 w-3.5" />
          <span className="sr-only">Print</span>
        </Button>
      )}
      
      {content && (
        <Popover>
          <PopoverTrigger asChild>
            <Button size="default" variant="outline" className="p-2 h-9 w-9">
              <Download className="h-3.5 w-3.5" />
              <span className="sr-only">Export</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="flex flex-col gap-2">
              <Button size="sm" onClick={handleExport}>HTML</Button>
              <Button size="sm" onClick={handleExportAsPdf}>PDF</Button>
              <Button size="sm" onClick={handleExportAsDocx}>DOCX</Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
      
      {onDelete && (
        <Button size="default" variant="outline" onClick={onDelete} className="p-2 h-9 w-9 text-destructive">
          <Trash2 className="h-3.5 w-3.5" />
          <span className="sr-only">Delete</span>
        </Button>
      )}
    </div>
  );
}
