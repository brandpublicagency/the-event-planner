
import { useState, useEffect, useCallback } from 'react';
import { Editor, EditorContent } from '@tiptap/react';
import { EditorToolbar } from "./EditorToolbar";
import LinkPreview from './LinkPreview';
import { fetchLinkPreview } from '@/api/supabaseApi';
import { debounce } from 'lodash';

interface DocumentContentProps {
  editor: Editor | null;
}

export function DocumentContent({ editor }: DocumentContentProps) {
  const [activeLinks, setActiveLinks] = useState<{url: string, id: string, loading?: boolean}[]>([]);
  const [previewsExpanded, setPreviewsExpanded] = useState(true);
  
  const extractLinks = useCallback(() => {
    if (!editor) return [];
    
    const links: {url: string, id: string, loading?: boolean}[] = [];
    
    // Try to use the ProseMirror document to extract links more accurately
    try {
      editor.state.doc.descendants((node) => {
        if (node.type.name === 'link' && node.attrs.href) {
          const url = node.attrs.href;
          if (!links.some(link => link.url === url)) {
            links.push({ 
              url, 
              id: `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              loading: false
            });
          }
        }
        return true;
      });
      
      // Fallback to regex on HTML if no links found (or if error occurs)
      if (links.length === 0) {
        const content = editor.getHTML();
        const urlRegex = /<a [^>]*href="(https?:\/\/[^"]+)"[^>]*>[^<]*<\/a>/g;
        
        let match;
        while ((match = urlRegex.exec(content)) !== null) {
          const url = match[1];
          if (!links.some(link => link.url === url)) {
            links.push({ 
              url, 
              id: `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              loading: false
            });
          }
        }
      }
    } catch (error) {
      console.error("Error extracting links:", error);
      // Fallback to regex method
      const content = editor.getHTML();
      const urlRegex = /<a [^>]*href="(https?:\/\/[^"]+)"[^>]*>[^<]*<\/a>/g;
      
      let match;
      while ((match = urlRegex.exec(content)) !== null) {
        const url = match[1];
        if (!links.some(link => link.url === url)) {
          links.push({ 
            url, 
            id: `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            loading: false
          });
        }
      }
    }
    
    return links;
  }, [editor]);
  
  useEffect(() => {
    if (!editor) return;
    
    // Debounce the update function to prevent excessive processing
    const updateLinks = debounce(() => {
      const newLinks = extractLinks();
      setActiveLinks(prevLinks => {
        const existingLinks = prevLinks.filter(link => 
          newLinks.some(newLink => newLink.url === link.url)
        );
        
        const linksToAdd = newLinks.filter(newLink => 
          !existingLinks.some(existing => existing.url === newLink.url)
        ).map(link => ({
          ...link,
          loading: true
        }));
        
        return [...existingLinks, ...linksToAdd];
      });
    }, 300);
    
    editor.on('update', updateLinks);
    
    updateLinks();
    
    return () => {
      editor.off('update', updateLinks);
      updateLinks.cancel(); // Cancel any pending debounce calls
    };
  }, [editor, extractLinks]);
  
  const removeLink = (linkId: string) => {
    setActiveLinks(links => links.filter(link => link.id !== linkId));
  };
  
  const retryFetch = (linkId: string) => {
    setActiveLinks(links => 
      links.map(link => 
        link.id === linkId 
          ? { ...link, loading: true } 
          : link
      )
    );
  };
  
  if (!editor) return null;

  return (
    <>
      <EditorToolbar editor={editor} />
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="bg-white rounded-lg border p-4 min-h-[300px] mb-4 flex-1">
          <EditorContent 
            editor={editor} 
            className="min-h-[300px]"
          />
        </div>
        
        {activeLinks.length > 0 && (
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Link Previews ({activeLinks.length})
              </h3>
              <button 
                onClick={() => setPreviewsExpanded(!previewsExpanded)}
                className="text-xs text-muted-foreground hover:text-foreground"
                aria-expanded={previewsExpanded}
                aria-controls="link-previews-list"
              >
                {previewsExpanded ? 'Collapse' : 'Expand'}
              </button>
            </div>
            
            {previewsExpanded && (
              <div 
                id="link-previews-list"
                className="space-y-3"
                role="list"
                aria-label="Link previews"
              >
                {activeLinks.map(link => (
                  <div key={link.id} role="listitem">
                    <LinkPreview 
                      url={link.url} 
                      onRemove={() => removeLink(link.id)}
                      onRetry={() => retryFetch(link.id)}
                      initialLoading={link.loading}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
