import { useState, useEffect, useCallback } from 'react';
import { Editor, EditorContent } from '@tiptap/react';
import { EditorToolbar } from "./EditorToolbar";
import LinkPreview from './LinkPreview';
import { fetchLinkPreview } from '@/api/supabaseApi';

interface DocumentContentProps {
  editor: Editor | null;
}

export function DocumentContent({ editor }: DocumentContentProps) {
  const [activeLinks, setActiveLinks] = useState<{url: string, id: string}[]>([]);
  
  const extractLinks = useCallback(() => {
    if (!editor) return [];
    
    const content = editor.getHTML();
    const urlRegex = /<a [^>]*href="(https?:\/\/[^"]+)"[^>]*>[^<]*<\/a>/g;
    const links: {url: string, id: string}[] = [];
    
    let match;
    while ((match = urlRegex.exec(content)) !== null) {
      const url = match[1];
      if (!links.some(link => link.url === url)) {
        links.push({ url, id: `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` });
      }
    }
    
    return links;
  }, [editor]);
  
  useEffect(() => {
    if (!editor) return;
    
    const updateLinks = () => {
      const newLinks = extractLinks();
      setActiveLinks(prevLinks => {
        const existingLinks = prevLinks.filter(link => 
          newLinks.some(newLink => newLink.url === link.url)
        );
        
        const linksToAdd = newLinks.filter(newLink => 
          !existingLinks.some(existing => existing.url === newLink.url)
        );
        
        return [...existingLinks, ...linksToAdd];
      });
    };
    
    editor.on('update', updateLinks);
    
    updateLinks();
    
    return () => {
      editor.off('update', updateLinks);
    };
  }, [editor, extractLinks]);
  
  const removeLink = (linkId: string) => {
    setActiveLinks(links => links.filter(link => link.id !== linkId));
  };
  
  if (!editor) return null;

  return (
    <>
      <EditorToolbar editor={editor} />
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white border rounded-lg mb-4">
          <EditorContent 
            editor={editor} 
            className="min-h-[300px] p-4"
          />
        </div>
        
        {activeLinks.length > 0 && (
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Link Previews</h3>
            <div className="space-y-3">
              {activeLinks.map(link => (
                <LinkPreview 
                  key={link.id} 
                  url={link.url} 
                  onRemove={() => removeLink(link.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
