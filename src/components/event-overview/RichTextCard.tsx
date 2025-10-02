import { useEditor, EditorContent } from '@tiptap/react';
import { useEffect, memo } from 'react';
import { getOverviewEditorExtensions } from './overviewEditorExtensions';
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Heading1, Heading2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import DOMPurify from 'dompurify';

interface RichTextCardProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  imageUrl?: string;
  onImageUrlChange?: (url: string) => void;
}

export const RichTextCard = memo(({ 
  title, 
  value, 
  onChange, 
  isEditing,
  imageUrl,
  onImageUrlChange 
}: RichTextCardProps) => {
  const editor = useEditor({
    extensions: getOverviewEditorExtensions(),
    content: value || '<p></p>',
    editable: isEditing,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none text-foreground'
      }
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (html !== value) {
        onChange(html);
      }
    },
  }, []);

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      const currentContent = editor.getHTML();
      const newContent = value || '<p></p>';
      
      if (currentContent !== newContent) {
        editor.commands.setContent(newContent, false);
      }
    }
  }, [value, editor]);

  // Update editor editable state when isEditing changes
  useEffect(() => {
    if (editor && editor.isEditable !== isEditing) {
      editor.setEditable(isEditing);
    }
  }, [isEditing, editor]);

  if (!editor) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-foreground/50">Loading editor...</p>
      </div>
    );
  }

  const sanitizedContent = DOMPurify.sanitize(value || '<p>No content</p>');

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      
      {isEditing && (
        <>
          <div className="flex flex-wrap gap-1 border-b border-border pb-2">
            <Button
              type="button"
              size="sm"
              variant={editor.isActive('bold') ? 'default' : 'ghost'}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant={editor.isActive('italic') ? 'default' : 'ghost'}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant={editor.isActive('underline') ? 'default' : 'ghost'}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-8" />
            <Button
              type="button"
              size="sm"
              variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-8" />
            <Button
              type="button"
              size="sm"
              variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>
          
          {onImageUrlChange && (
            <div>
              <label className="text-xs text-foreground/70">Image URL (optional)</label>
              <input
                type="text"
                value={imageUrl || ''}
                onChange={(e) => onImageUrlChange(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full mt-1 px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground"
              />
            </div>
          )}
        </>
      )}
      
      {isEditing ? (
        <EditorContent 
          editor={editor} 
          className="prose prose-sm max-w-none min-h-[100px] text-foreground"
        />
      ) : (
        <div 
          className="prose prose-sm max-w-none text-foreground"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      )}
      
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full rounded-md mt-2"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      )}
    </div>
  );
});

RichTextCard.displayName = 'RichTextCard';
