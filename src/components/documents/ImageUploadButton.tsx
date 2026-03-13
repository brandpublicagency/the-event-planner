import { useRef, useState } from "react";
import { Editor } from "@tiptap/react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";
import { ImageIcon, Upload, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ImageUploadButtonProps {
  editor: Editor;
  variant?: "toolbar" | "standalone";
}

export function ImageUploadButton({ editor, variant = "toolbar" }: ImageUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB");
      return;
    }

    setIsUploading(true);
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
    } catch (err: any) {
      console.error("Image upload failed:", err);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUrlInsert = () => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-7 w-7 p-0 flex items-center justify-center rounded-md",
              "text-muted-foreground hover:text-foreground"
            )}
            title="Insert Image"
            type="button"
            disabled={isUploading}
          >
            <ImageIcon className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          <DropdownMenuItem onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload from device"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleUrlInsert}>
            <Link className="h-4 w-4 mr-2" />
            Insert from URL
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

// Global event for slash command image upload
export function triggerImageUpload() {
  const event = new CustomEvent("editor-image-upload");
  window.dispatchEvent(event);
}
