
import { 
  Bold, Italic, Link, Heading1, Heading2, Heading3, 
  List, ListOrdered, Code, Quote, Underline, 
  Highlighter, Image
} from "lucide-react";
import { Editor } from "@tiptap/react";
import { isMarkActive } from "./editorExtensions";

interface EditorToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  // Function to handle paste event to detect URLs
  const handleLinkPreview = () => {
    const url = window.prompt('Enter URL');
    
    if (url && editor) {
      editor.chain().focus().insertContent({
        type: 'linkPreview',
        attrs: { url }
      }).run();
    }
  };

  // Check if heading is active - explicitly checking for level
  const isHeadingActive = (level: number) => {
    return editor.isActive('heading', { level });
  };

  return (
    <div className="editor-toolbar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
        title="Bold"
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
        title="Italic"
      >
        <Italic size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'is-active' : ''}
        title="Underline"
      >
        <Underline size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={editor.isActive('highlight') ? 'is-active' : ''}
        title="Highlight"
      >
        <Highlighter size={18} />
      </button>

      <div className="divider"></div>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={isHeadingActive(1) ? 'is-active' : ''}
        title="Heading 1"
      >
        <Heading1 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={isHeadingActive(2) ? 'is-active' : ''}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={isHeadingActive(3) ? 'is-active' : ''}
        title="Heading 3"
      >
        <Heading3 size={18} />
      </button>

      <div className="divider"></div>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
        title="Bullet List"
      >
        <List size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
        title="Ordered List"
      >
        <ListOrdered size={18} />
      </button>

      <div className="divider"></div>

      <button
        onClick={() => {
          const url = window.prompt('Enter URL');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={editor.isActive('link') ? 'is-active' : ''}
        title="Link"
      >
        <Link size={18} />
      </button>
      
      <button
        onClick={handleLinkPreview}
        title="Insert Link Preview"
      >
        <Image size={18} />
      </button>

      <div className="divider"></div>

      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active' : ''}
        title="Code Block"
      >
        <Code size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
        title="Quote"
      >
        <Quote size={18} />
      </button>
    </div>
  );
}
