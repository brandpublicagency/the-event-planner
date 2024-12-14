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
  });

  const { data: documentData, isLoading, error } = useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      if (!documentId) return null;
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .maybeSingle();

      if (error) throw error;
      return data as Document | null;
    },
    enabled: !!documentId,
  });

  useEffect(() => {
    if (documentData) {
      setTitle(documentData.title);
      const content = documentData.content as unknown as DocumentContent;
      if (content?.html) {
        editor?.commands.setContent(content.html);
      } else {
        editor?.commands.setContent("");
      }
    }
  }, [documentData, editor]);

  const updateDocument = useMutation({
    mutationFn: async () => {
      if (!documentId || !editor) return;
      const { error } = await supabase
        .from("documents")
        .update({
          title,
          content: {
            html: editor.getHTML(),
            text: editor.getText(),
          },
        })
        .eq("id", documentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["document", documentId] });
      toast({
        title: "Document saved",
        description: "Your changes have been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving document",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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

  if (error || !documentData) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Document not found or error loading document
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          className="text-lg font-medium bg-transparent border-none h-auto px-0 focus-visible:ring-0"
        />
        <DocumentActions
          title={title}
          editor={editor}
          onSave={() => updateDocument.mutate()}
          isSaving={updateDocument.isPending}
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