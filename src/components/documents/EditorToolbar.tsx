import { Bold, Italic, Underline, Heading, Link, List, ListOrdered, SeparatorHorizontal } from "lucide-react";
import { Editor } from '@tiptap/react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface MenuButtonProps {
  onClick: () => void;
  active?: boolean;
  icon: any;
  tooltip: string;
}

const MenuButton = ({ onClick, active, icon: Icon, tooltip }: MenuButtonProps) => (
  <Button
    variant="ghost"
    size="sm"
    className={`h-8 w-8 p-0 ${active ? 'bg-accent' : ''}`}
    onClick={onClick}
    title={tooltip}
  >
    <Icon className="h-4 w-4" />
  </Button>
);

interface EditorToolbarProps {
  editor: Editor | null;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg mb-4 p-1 flex items-center gap-1 bg-background">
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
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
        icon={Heading}
        tooltip="Heading"
      />
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
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        icon={SeparatorHorizontal}
        tooltip="Add Divider"
      />
    </div>
  );
}