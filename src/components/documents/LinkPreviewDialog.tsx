
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Editor } from '@tiptap/react';
import { isValidUrl } from './extensions/LinkPasteHandler';

interface LinkPreviewDialogProps {
  editor: Editor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LinkPreviewDialog({ 
  editor, 
  open, 
  onOpenChange 
}: LinkPreviewDialogProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleInsert = () => {
    if (!editor || !url.trim()) {
      setError("Please enter a URL");
      return;
    }

    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    
    if (!isValidUrl(formattedUrl)) {
      setError("Please enter a valid URL");
      return;
    }

    // Insert link preview
    editor.chain().focus().setLinkPreview({ url: formattedUrl }).run();
    
    // Reset and close
    setUrl("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insert Link Preview</DialogTitle>
          <DialogDescription>
            Enter a URL to create a link preview card.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <Input
            placeholder="https://example.com"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError("");
            }}
            className={error ? "border-red-500" : ""}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setUrl("");
              setError("");
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleInsert}>
            Insert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
