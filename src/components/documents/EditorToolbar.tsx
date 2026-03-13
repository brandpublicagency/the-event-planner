
import { 
  Bold, Italic, Underline, Heading1, Heading2, Heading3,
  Link, List, ListOrdered, SeparatorHorizontal, Code,
  Highlighter, Quote, ExternalLink, Table,
  CheckSquare, Undo, Redo
} from "lucide-react";
import { Editor } from '@tiptap/react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { LinkPreviewDialog } from "./LinkPreviewDialog";
import { ImageUploadButton } from "./ImageUploadButton";

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
    className={cn(
      "h-7 w-7 p-0 flex items-center justify-center rounded-md",
      active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
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

  if (!editor) return null;

  const isInTable = editor.isActive('table');

  return (
    <div className="border rounded-lg mb-2 p-1 flex items-center gap-0.5 flex-wrap bg-background">
      {/* Undo / Redo */}
      <MenuButton onClick={() => editor.chain().focus().undo().run()} icon={Undo} tooltip="Undo" />
      <MenuButton onClick={() => editor.chain().focus().redo().run()} icon={Redo} tooltip="Redo" />

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Text formatting */}
      <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} icon={Bold} tooltip="Bold" />
      <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} icon={Italic} tooltip="Italic" />
      <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} icon={Underline} tooltip="Underline" />
      <MenuButton onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} icon={Highlighter} tooltip="Highlight" />

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Headings */}
      <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} icon={Heading1} tooltip="Heading 1" />
      <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} icon={Heading2} tooltip="Heading 2" />
      <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} icon={Heading3} tooltip="Heading 3" />

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Lists */}
      <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} icon={List} tooltip="Bullet List" />
      <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} icon={ListOrdered} tooltip="Numbered List" />
      <MenuButton onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive('taskList')} icon={CheckSquare} tooltip="Task List" />
      <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} icon={Quote} tooltip="Quote" />

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Insert */}
      <MenuButton
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        active={editor.isActive('table')}
        icon={Table}
        tooltip="Insert Table"
      />
      <ImageUploadButton editor={editor} />
      <MenuButton
        onClick={() => {
          const url = window.prompt('Enter URL');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        active={editor.isActive('link')}
        icon={Link}
        tooltip="Add Link"
      />
      <MenuButton onClick={() => setLinkPreviewDialogOpen(true)} active={editor.isActive('linkPreview')} icon={ExternalLink} tooltip="Link Preview" />
      <MenuButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} icon={Code} tooltip="Code Block" />
      <MenuButton onClick={() => editor.chain().focus().setHorizontalRule().run()} icon={SeparatorHorizontal} tooltip="Divider" />

      {/* Table controls — contextual */}
      {isInTable && (
        <>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground" onClick={() => editor.chain().focus().addColumnAfter().run()}>+ Col</Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground" onClick={() => editor.chain().focus().addRowAfter().run()}>+ Row</Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-destructive hover:text-destructive" onClick={() => editor.chain().focus().deleteColumn().run()}>− Col</Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-destructive hover:text-destructive" onClick={() => editor.chain().focus().deleteRow().run()}>− Row</Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-destructive hover:text-destructive" onClick={() => editor.chain().focus().deleteTable().run()}>Delete Table</Button>
        </>
      )}
      
      <LinkPreviewDialog editor={editor} open={linkPreviewDialogOpen} onOpenChange={setLinkPreviewDialogOpen} />
    </div>
  );
}
