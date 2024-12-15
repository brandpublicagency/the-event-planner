import { useEditor } from '@tiptap/react';
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { DocumentActions } from "./DocumentActions";
import { DocumentContent } from "./DocumentContent";
import { getEditorExtensions } from "./editorExtensions";
import { useDocument } from "@/hooks/useDocument";

interface DocumentEditorProps {
  documentId: string | null;
}

export default function DocumentEditor({ documentId }: DocumentEditorProps) {
  const [title, setTitle] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const debouncedTitle = useDebounce(title, 500);

  // Initialize authentication state
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          console.error("Auth error:", error);
          toast({
            title: "Authentication required",
            description: "Please sign in to access documents",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        navigate("/login");
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setIsAuthenticated(false);
        navigate("/login");
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const { document, isLoading, error, updateDocument } = useDocument(documentId, isAuthenticated);

  const editor = useEditor({
    extensions: getEditorExtensions(),
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      if (!documentId || !isAuthenticated) return;
      
      updateDocument.mutate({
        content: {
          type: 'doc',
          html: editor.getHTML(),
          text: editor.getText(),
        }
      });
    },
  });

  // Update editor content when document changes
  useEffect(() => {
    if (document && editor) {
      setTitle(document.title);
      if (document.content) {
        const content = document.content as any;
        editor.commands.setContent(content.html || "");
      }
    }
  }, [document, editor]);

  // Update title when it changes
  useEffect(() => {
    if (documentId && isAuthenticated && debouncedTitle !== document?.title) {
      updateDocument.mutate({ title: debouncedTitle });
    }
  }, [debouncedTitle, documentId, document?.title, isAuthenticated]);

  if (!documentId) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select a document to edit
      </div>
    );
  }

  if (!isAuthenticated || isLoading) {
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
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          className="text-lg font-medium bg-transparent border-none h-auto px-0 focus-visible:ring-0"
        />
        <DocumentActions
          documentId={documentId}
          title={title}
          editor={editor}
        />
      </div>

      <DocumentContent editor={editor} />
    </div>
  );
}