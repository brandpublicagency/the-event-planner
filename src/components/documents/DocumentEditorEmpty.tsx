
import React from 'react';

interface DocumentEditorEmptyProps {
  message?: string;
  description?: string;
}

export function DocumentEditorEmpty({ 
  message = "No document selected", 
  description = "Select a document from the list or create a new one to start editing." 
}: DocumentEditorEmptyProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md">
        <h3 className="text-lg font-medium mb-2">{message}</h3>
        <p className="text-muted-foreground mb-4">
          {description}
        </p>
      </div>
    </div>
  );
}
