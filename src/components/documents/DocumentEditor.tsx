import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import { EditorToolbar } from "./EditorToolbar";
import { DocumentActions } from "./DocumentActions";
import { getEditorExtensions } from "./editorExtensions";
import type { Document, DocumentContent } from "@/types/document";

interface DocumentEditorProps {
  documentId: string | null;
}

export default function DocumentEditor({ documentId }: DocumentEditorProps) {
  const [title, setTitle] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const editor = useEditor({
    extensions: getEditorExtensions(),
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      if (documentId) {
        updateDocument.mutate();
      }
    },
  });

  const { data: document, isLoading, error } = useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      if (!documentId) return null;
      
      // Increased timeout to 30 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Document fetch timed out")), 30000);
      });

      try {
        const result = await Promise.race([
          supabase
            .from("documents")
            .select("*")
            .eq("id", documentId)
            .single(),
          timeoutPromise
        ]);

        // Type assertion to handle Supabase response
        const response = result as { data: Document | null, error: any };
        if (response.error) throw response.error;
        if (!response.data) throw new Error("Document not found");
        return response.data;
      } catch (error) {
        console.error("Error fetching document:", error);
        throw error;
      }
    },
    enabled: !!documentId,
    retry: 1,
    staleTime: 30000,
  });

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      if (document.content) {
        // Type assertion to ensure content matches DocumentContent structure
        const content = document.content as unknown as DocumentContent;
        if (content?.html) {
          editor?.commands.setContent(content.html);
        } else {
          editor?.commands.setContent("");
        }
      }
    }
  }, [document, editor]);

  const updateDocument = useMutation({
    mutationFn: async () => {
      if (!documentId || !editor) return;

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Save operation timed out")), 10000);
      });

      try {
        const updatePromise = supabase
          .from("documents")
          .update({
            title,
            content: {
              html: editor.getHTML(),
              text: editor.getText(),
            },
          })
          .eq("id", documentId);

        await Promise.race([updatePromise, timeoutPromise]);
      } catch (error) {
        console.error("Error saving document:", error);
        throw error;
      }
    },
    onError: (error: Error) => {
      console.error("Save error:", error);
      toast({
        title: "Error saving document",
        description: error.message || "Failed to save document. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    updateDocument.mutate();
  };

  if (!documentId) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select a document to edit
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        {error ? `Error: ${error.message}` : "Document not found"}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder="Untitled"
          className="text-lg font-medium bg-transparent border-none h-auto px-0 focus-visible:ring-0"
        />
        <DocumentActions
          title={title}
          editor={editor}
        />
      </div>

      <EditorToolbar editor={editor} />

      <div className="flex-1 overflow-y-auto bg-white border rounded-lg">
        <EditorContent 
          editor={editor} 
          className="min-h-[500px] p-4" 
        />
      </div>
    </div>
  );
}