
import { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { useDocument } from './useDocument';
import type { DocumentContent } from "@/types/document";
import { isDocumentContent } from "@/types/document";
import { supabase } from "@/integrations/supabase/client";

// Define the interface for saveDocument parameters
interface SaveDocumentOptions {
  title?: string;
  content?: string;
  showToast?: boolean;
}

// Utility to extract mentions from HTML content
const extractMentions = (content: string) => {
  const mentionRegex = /<span[^>]*data-mention[^>]*data-id="([^"]*)"[^>]*data-type="([^"]*)"[^>]*>/g;
  const mentions: { id: string; type: string }[] = [];
  let match;
  
  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push({
      id: match[1],
      type: match[2]
    });
  }
  
  return mentions;
};

// Update mentions tracking in database
const updateMentions = async (documentId: string, mentions: { id: string; type: string }[]) => {
  if (!documentId || !mentions.length) return;
  
  try {
    // First, update the current document's mentions list
    await supabase
      .from('documents')
      .update({ mentions: mentions })
      .eq('id', documentId);
    
    // Then, update mentioned_in for each referenced item
    for (const mention of mentions) {
      const { id, type } = mention;
      
      // Construct the reference to this document
      const mentionedInRef = {
        id: documentId,
        type: 'document'
      };
      
      // Update the appropriate table based on the mention type
      if (type === 'document') {
        // Check if mentioned_in already contains this document
        const { data: targetDoc } = await supabase
          .from('documents')
          .select('mentioned_in')
          .eq('id', id)
          .single();
        
        if (targetDoc) {
          // Parse the mentioned_in array and check if this document is already there
          const mentionedIn = targetDoc.mentioned_in || [];
          const alreadyMentioned = mentionedIn.some(
            (mention: any) => mention.id === documentId && mention.type === 'document'
          );
          
          if (!alreadyMentioned) {
            // Add this document to the mentioned_in array
            await supabase
              .from('documents')
              .update({
                mentioned_in: [...mentionedIn, mentionedInRef]
              })
              .eq('id', id);
          }
        }
      } else if (type === 'task') {
        // Similar logic for tasks
        const { data: targetTask } = await supabase
          .from('tasks')
          .select('mentioned_in')
          .eq('id', id)
          .single();
        
        if (targetTask) {
          const mentionedIn = targetTask.mentioned_in || [];
          const alreadyMentioned = mentionedIn.some(
            (mention: any) => mention.id === documentId && mention.type === 'document'
          );
          
          if (!alreadyMentioned) {
            await supabase
              .from('tasks')
              .update({
                mentioned_in: [...mentionedIn, mentionedInRef]
              })
              .eq('id', id);
          }
        }
      } else if (type === 'event') {
        // Similar logic for events
        const { data: targetEvent } = await supabase
          .from('events')
          .select('mentioned_in')
          .eq('event_code', id)
          .single();
        
        if (targetEvent) {
          const mentionedIn = targetEvent.mentioned_in || [];
          const alreadyMentioned = mentionedIn.some(
            (mention: any) => mention.id === documentId && mention.type === 'document'
          );
          
          if (!alreadyMentioned) {
            await supabase
              .from('events')
              .update({
                mentioned_in: [...mentionedIn, mentionedInRef]
              })
              .eq('event_code', id);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error updating mentions:', error);
  }
};

export function useDocumentState(documentId: string | null, editor: Editor | null, isAuthenticated: boolean) {
  const [isSaving, setIsSaving] = useState(false);
  const { document, isLoading, error, updateDocument } = useDocument(documentId, isAuthenticated);
  const [contentSet, setContentSet] = useState(false);
  const [editorReady, setEditorReady] = useState(false);

  // Track when the editor is ready for content
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      setEditorReady(true);
    } else {
      setEditorReady(false);
    }
  }, [editor]);

  // Reset contentSet when document changes
  useEffect(() => {
    if (documentId) {
      setContentSet(false);
    }
  }, [documentId]);

  // Load initial document content
  useEffect(() => {
    if (!editorReady || !document?.content || contentSet) return;

    console.log("Loading document content:", document.content);

    try {
      if (isDocumentContent(document.content)) {
        console.log("Setting editor content to:", document.content.html?.substring(0, 100));
        editor?.commands.setContent(document.content.html || '');
        setContentSet(true);
      } else {
        console.warn("Invalid document content format:", document.content);
      }
    } catch (err) {
      console.error("Error setting document content:", err);
    }
  }, [document, editorReady, editor, contentSet]);

  const saveDocument = async (options: SaveDocumentOptions = {}) => {
    const { title, content: contentOverride, showToast = true } = options;
    
    if (!editor && !contentOverride || !documentId) {
      console.log("Cannot save: editor or documentId is missing");
      return;
    }

    const currentContent = contentOverride || editor?.getHTML() || '';
    const lines = editor ? editor.getText().split('\n') : [];
    const firstLine = title || lines[0] || 'Untitled Document';

    const content: DocumentContent = {
      type: "doc",
      html: currentContent,
      text: editor ? editor.getText() : '',
    };

    setIsSaving(true);
    try {
      // Extract mentions from content
      const mentions = extractMentions(currentContent);
      
      // Update the document content
      await updateDocument.mutateAsync({ 
        title: firstLine,
        content: content,
        showToast 
      });
      
      // Update mentions tracking in database
      await updateMentions(documentId, mentions);
      
      console.log("Document saved successfully");
    } catch (error) {
      console.error("Error saving document:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    document,
    isLoading,
    error,
    saveDocument,
    isSaving,
    contentSet
  };
}
