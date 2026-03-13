import { useEffect, useRef } from "react";
import { Editor } from "@tiptap/react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";

interface ImageUploadListenerProps {
  editor: Editor;
}

export function ImageUploadListener({ editor }: ImageUploadListenerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = () => {
      fileInputRef.current?.click();
    };
    window.addEventListener("editor-image-upload", handler);
    return () => window.removeEventListener("editor-image-upload", handler);
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    try {
      const filePath = `document-images/${uuid()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("taskmanager-files")
        .upload(filePath, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("taskmanager-files")
        .getPublicUrl(data.path);

      editor.chain().focus().setImage({ src: urlData.publicUrl }).run();
      toast.success("Image uploaded");
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("Failed to upload image");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleFileSelect}
    />
  );
}
