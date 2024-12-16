import { Editor, EditorContent } from '@tiptap/react';
import { EditorToolbar } from "./EditorToolbar";
import { LinkPreview } from "./LinkPreview";
import { createRoot } from 'react-dom/client';
import { useEffect, useRef } from 'react';

interface DocumentContentProps {
  editor: Editor | null;
}

export function DocumentContent({ editor }: DocumentContentProps) {
  if (!editor) return null;

  const contentRef = useRef<HTMLDivElement>(null);

  // Use useEffect to handle link preview rendering after content updates
  useEffect(() => {
    if (!contentRef.current) return;
    
    const previewElements = contentRef.current.querySelectorAll('p');
    previewElements.forEach((element) => {
      const text = element.textContent;
      if (text?.startsWith('<link-preview url="') && text?.endsWith('">')) {
        const url = text.match(/url="([^"]+)"/)?.[1];
        if (url) {
          // Create a new div for the preview
          const previewContainer = document.createElement('div');
          element.replaceWith(previewContainer);
          
          // Render the LinkPreview component
          const root = createRoot(previewContainer);
          root.render(<LinkPreview url={url} />);
        }
      }
    });
  }, [editor.getHTML()]);

  return (
    <>
      <EditorToolbar editor={editor} />
      <div className="flex-1 overflow-y-auto bg-white border rounded-lg">
        <EditorContent 
          editor={editor} 
          className="min-h-[500px] p-4"
          ref={contentRef}
        />
      </div>
    </>
  );
}