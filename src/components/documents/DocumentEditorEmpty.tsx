
import React from 'react';
import { FileText, Plus } from 'lucide-react';

interface DocumentEditorEmptyProps {
  message?: string;
  description?: string;
}

export function DocumentEditorEmpty({
  message = "No document selected",
  description = "Select a document from the sidebar or create a new one."
}: DocumentEditorEmptyProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <FileText className="h-10 w-10 text-muted-foreground/20 mb-3" />
      <p className="text-sm font-medium text-muted-foreground mb-1">{message}</p>
      <p className="text-xs text-muted-foreground/60 max-w-[240px]">{description}</p>
    </div>
  );
}
