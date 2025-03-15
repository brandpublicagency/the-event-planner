
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Printer } from "lucide-react";
import { exportAsPdf, exportAsDocx } from "@/utils/exportUtils";
import { useToast } from "@/hooks/use-toast";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

interface DocumentActionsProps {
  documentId: string;
  title: string;
  content: string;
  editorRef?: React.RefObject<HTMLDivElement>;
}

export default function DocumentActions({ documentId, title, content, editorRef }: DocumentActionsProps) {
  const { toast } = useToast();

  const handleExport = async (format: 'pdf' | 'docx') => {
    try {
      if (format === 'pdf') {
        await exportAsPdf(content, title);
        toast({
          title: "Export Successful",
          description: `Document exported as PDF`,
          variant: "success",
          showProgress: true
        });
      } else {
        await exportAsDocx(content, title);
        toast({
          title: "Export Successful",
          description: `Document exported as DOCX`,
          variant: "success",
          showProgress: true
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your document",
        variant: "destructive",
        showProgress: true
      });
    }
  };

  const handlePrint = useReactToPrint({
    documentTitle: title,
    onPrintError: (error) => {
      console.error('Print error:', error);
      toast({
        title: "Print Failed",
        description: "There was an error printing your document",
        variant: "destructive",
      });
    },
    pageStyle: `
      @page {
        size: A4;
        margin: 15mm;
      }
      @media print {
        body * {
          visibility: hidden;
        }
        .print-document, .print-document * {
          visibility: visible;
        }
        .print-document {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          padding: 0;
          margin: 0;
        }
        .ProseMirror {
          font-size: 12pt;
          line-height: 1.5;
        }
      }
    `,
    onAfterPrint: () => {
      toast({
        title: "Print Completed",
        description: "Your document has been sent to the printer",
        variant: "success",
      });
    },
    contentResolver: () => editorRef?.current || null,
  });

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handlePrint}
        className="flex items-center gap-1.5 h-7 px-2 min-w-[60px]"
        disabled={!editorRef?.current}
      >
        <Printer className="h-3 w-3" />
        Print
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1.5 h-7 px-2 min-w-[60px]"
          >
            <Download className="h-3 w-3" />
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
    </div>
  );
}
