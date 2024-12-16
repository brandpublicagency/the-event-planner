import { Editor, EditorContent } from '@tiptap/react';
import { EditorToolbar } from "./EditorToolbar";
import { LinkPreview } from "./LinkPreview";
import { useEffect, useRef, useState } from 'react';

interface DocumentContentProps {
  editor: Editor | null;
}

export function DocumentContent({ editor }: DocumentContentProps) {
  if (!editor) return null;

  const [linkPreviews, setLinkPreviews] = useState<Array<{ id: string; url: string }>>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  // Use useEffect to handle link preview rendering after content updates
  useEffect(() => {
    if (!contentRef.current) return;
    
    const previewElements = contentRef.current.querySelectorAll('p');
    const newPreviews: Array<{ id: string; url: string }> = [];
    
    previewElements.forEach((element, index) => {
      const text = element.textContent;
      if (text?.startsWith('<link-preview url="') && text?.endsWith('">')) {
        const url = text.match(/url="([^"]+)"/)?.[1];
        if (url) {
          const id = `preview-${index}`;
          newPreviews.push({ id, url });
          
          // Replace the text node with a placeholder div
          const placeholder = document.createElement('div');
          placeholder.id = id;
          element.replaceWith(placeholder);
        }
      }
    });
    
    setLinkPreviews(newPreviews);
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
        {linkPreviews.map(({ id, url }) => (
          <div key={id} id={id}>
            <LinkPreview url={url} />
          </div>
        ))}
      </div>
    </>
  );
}