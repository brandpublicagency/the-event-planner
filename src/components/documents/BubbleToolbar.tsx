import { BubbleMenu, Editor } from '@tiptap/react';
import {
  Bold, Italic, Underline, Strikethrough, Code, Link, Highlighter
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BubbleToolbarProps {
  editor: Editor;
}

interface BubbleButtonProps {
  onClick: () => void;
  active?: boolean;
  icon: any;
  tooltip: string;
}

const BubbleButton = ({ onClick, active, icon: Icon, tooltip }: BubbleButtonProps) => (
  <button
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    title={tooltip}
    type="button"
    className={cn(
      'h-7 w-7 flex items-center justify-center rounded-md transition-colors',
      active
        ? 'bg-primary-foreground/20 text-primary-foreground'
        : 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10'
    )}
  >
    <Icon className="h-3.5 w-3.5" />
  </button>
);

const Divider = () => <div className="w-px h-5 bg-primary-foreground/20 mx-0.5" />;

export function BubbleToolbar({ editor }: BubbleToolbarProps) {
  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 150, placement: 'top' }}
      className="flex items-center gap-0.5 rounded-lg bg-foreground px-1.5 py-1 shadow-xl border border-foreground"
    >
      <BubbleButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        icon={Bold}
        tooltip="Bold"
      />
      <BubbleButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        icon={Italic}
        tooltip="Italic"
      />
      <BubbleButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive('underline')}
        icon={Underline}
        tooltip="Underline"
      />
      <BubbleButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive('strike')}
        icon={Strikethrough}
        tooltip="Strikethrough"
      />
      <BubbleButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive('code')}
        icon={Code}
        tooltip="Inline Code"
      />

      <Divider />

      <BubbleButton
        onClick={() => {
          const url = window.prompt('Enter URL');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        active={editor.isActive('link')}
        icon={Link}
        tooltip="Link"
      />
      <BubbleButton
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        active={editor.isActive('highlight')}
        icon={Highlighter}
        tooltip="Highlight"
      />
    </BubbleMenu>
  );
}
