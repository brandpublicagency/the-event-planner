
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Copy, Edit, MoreHorizontal, Download, Printer } from "lucide-react"
import { useState } from "react";
import { useReactToPrint } from 'react-to-print';
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import * as React from "react"; // Add explicit React import

interface DocumentActionsProps {
  document: any;
  onEdit: () => void;
}

export function DocumentActions({ document, onEdit }: DocumentActionsProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const printRef = React.useRef(null);

  const handlePrint = useReactToPrint({
    documentTitle: `${document.title || 'Document'}.pdf`,
    onBeforePrint: () => setIsPrinting(true),
    onAfterPrint: () => setIsPrinting(false),
    content: () => printRef.current
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          navigator.clipboard.writeText(document.id)
          toast({
            description: "Document ID copied to clipboard.",
          })
        }}>
          <Copy className="mr-2 h-4 w-4" /> Copy ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={isPrinting} onClick={handlePrint} className={cn({
          "cursor-not-allowed opacity-50": isPrinting,
        })}>
          <Printer className="mr-2 h-4 w-4" />
          {isPrinting ? "Printing..." : "Print"}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Download className="mr-2 h-4 w-4" /> Download
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
