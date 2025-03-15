
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Download, Printer, Share, Trash, 
  FileEdit, Eye, ArrowLeftRight 
} from "lucide-react";
import { useReactToPrint } from 'react-to-print';
import { Document } from '@/types/document';
import { exportDocument } from '@/utils/documentUtils';

export interface DocumentActionsProps {
  document: Document;
  content?: string;
  onEdit: () => void;
  onDelete?: () => void;
  printRef?: React.RefObject<HTMLDivElement>;
}

export function DocumentActions({ 
  document, 
  content, 
  onEdit, 
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
    // Only use content if printRef exists
    content: printRef ? () => printRef.current : undefined
  });

  const handleExport = () => {
    if (content) {
      exportDocument(content, document.title);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {printRef && (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => handlePrint()} 
          className="p-2 h-8 w-8"
        >
          <Printer className="h-4 w-4" />
          <span className="sr-only">Print</span>
        </Button>
      )}
      
      {content && (
        <Button size="sm" variant="outline" onClick={handleExport} className="p-2 h-8 w-8">
          <Download className="h-4 w-4" />
          <span className="sr-only">Export</span>
        </Button>
      )}
      
      <Button size="sm" variant="outline" onClick={onEdit} className="p-2 h-8 w-8">
        <FileEdit className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>
      
      {onDelete && (
        <Button size="sm" variant="outline" onClick={onDelete} className="p-2 h-8 w-8 text-destructive">
          <Trash className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      )}
    </div>
  );
}
