import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { useState, useEffect } from "react";

interface DocumentEditorProps {
  documentId: string | null;
}

export default function DocumentEditor({ documentId }: DocumentEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: document, isLoading } = useQuery({
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
    if (document) {
      setTitle(document.title);
      setContent(document.content?.text || "");
    }
  }, [document]);

  const updateDocument = useMutation({
    mutationFn: async () => {
      if (!documentId) return;
      const { error } = await supabase
        .from("documents")
        .update({
          title,
          content: { text: content },
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
        <Button
          onClick={() => updateDocument.mutate()}
          disabled={updateDocument.isPending}
        >
          {updateDocument.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span className="ml-2">Save</span>
        </Button>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing..."
        className="flex-1 resize-none bg-transparent focus:outline-none"
      />
    </div>
  );
}