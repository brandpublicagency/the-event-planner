import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { EditorToolbar } from "./EditorToolbar";
import { DocumentActions } from "./DocumentActions";

interface DocumentEditorProps {
  documentId: string | null;
}

interface DocumentContent {
  text: string;
  html: string;
}

export default function DocumentEditor({ documentId }: DocumentEditorProps) {
  const [title, setTitle] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
    ],
  });

  const { data: documentData, isLoading } = useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      if (!documentId) return null;
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!documentId,
  });

  useEffect(() => {
    if (documentData) {
      setTitle(documentData.title);
      const documentContent = documentData.content as unknown;
      if (
        documentContent &&
        typeof documentContent === "object" &&
        "html" in documentContent
      ) {
        editor?.commands.setContent((documentContent as DocumentContent).html);
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
    onError: (error) => {
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

      <EditorContent 
        editor={editor} 
        className="flex-1 overflow-y-auto prose prose-sm max-w-none bg-white border rounded-lg p-4"
      />
    </div>
  );
}