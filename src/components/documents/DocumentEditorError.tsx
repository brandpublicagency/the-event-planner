
import React from 'react';

interface DocumentEditorErrorProps {
  error: Error | null;
  fallbackMessage?: string;
}

export function DocumentEditorError({ 
  error, 
  fallbackMessage = "Document not found" 
}: DocumentEditorErrorProps) {
  return (
    <div className="h-full flex items-center justify-center text-muted-foreground">
      {error ? `Error: ${error.message}` : fallbackMessage}
    </div>
  );
}
