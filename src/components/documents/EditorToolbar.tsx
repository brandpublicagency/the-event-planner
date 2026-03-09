
import { 
  Bold, Italic, Underline, Heading1, Heading2, Heading3,
  Link, List, ListOrdered, SeparatorHorizontal, Code,
  Highlighter, Quote, ExternalLink
} from "lucide-react";
import { Editor } from '@tiptap/react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { LinkPreviewDialog } from "./LinkPreviewDialog";

interface MenuButtonProps {
  onClick: () => void;
  active?: boolean;
  icon: any;
  tooltip: string;
}

const MenuButton = ({ onClick, active, icon: Icon, tooltip }: MenuButtonProps) => (
  <Button
    variant={active ? "default" : "ghost"}
    size="sm"
    className={cn(
      "h-7 w-7 p-0 flex items-center justify-center",
      active ? 'bg-accent text-accent-foreground' : ''
    )}
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    title={tooltip}
    type="button"
  >
    <Icon className="h-3.5 w-3.5" />
  </Button>
);

interface EditorToolbarProps {
  editor: Editor | null;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const [linkPreviewDialogOpen, setLinkPreviewDialogOpen] = useState(false);

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg mb-4 p-1.5 flex items-center gap-1 flex-wrap bg-background">
      <MenuButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        icon={Bold}
        tooltip="Bold"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        icon={Italic}
        tooltip="Italic"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive('underline')}
        icon={Underline}
        tooltip="Underline"
      />
      <Separator orientation="vertical" className="mx-1 h-6" />
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive('heading', { level: 1 })}
        icon={Heading1}
        tooltip="Heading 1"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
        icon={Heading2}
        tooltip="Heading 2"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
        icon={Heading3}
        tooltip="Heading 3"
      />
      <Separator orientation="vertical" className="mx-1 h-6" />
      <MenuButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        icon={List}
        tooltip="Bullet List"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        icon={ListOrdered}
        tooltip="Numbered List"
      />
      <Separator orientation="vertical" className="mx-1 h-6" />
      <MenuButton
        onClick={() => {
          const url = window.prompt('Enter URL');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        active={editor.isActive('link')}
        icon={Link}
        tooltip="Add Link"
      />
      <MenuButton
        onClick={() => setLinkPreviewDialogOpen(true)}
        active={editor.isActive('linkPreview')}
        icon={ExternalLink}
        tooltip="Add Link Preview"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive('codeBlock')}
        icon={Code}
        tooltip="Code Block"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        active={editor.isActive('highlight')}
        icon={Highlighter}
        tooltip="Highlight"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
        icon={Quote}
        tooltip="Quote"
      />
      <MenuButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        icon={SeparatorHorizontal}
        tooltip="Add Divider"
      />
      
      <LinkPreviewDialog 
        editor={editor} 
        open={linkPreviewDialogOpen} 
        onOpenChange={setLinkPreviewDialogOpen} 
      />
    </div>
  );
}
