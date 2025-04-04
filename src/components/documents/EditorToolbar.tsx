
import { 
  Bold, Italic, Link, Heading1, Heading2, Heading3, 
  List, ListOrdered, Code, Quote, Underline, 
  Highlighter, Minus
} from "lucide-react";
import { Editor } from "@tiptap/react";
import { isMarkActive, isHeadingActive } from "./editorExtensions";
import { Separator } from "@/components/ui/separator";

interface EditorToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
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

      <Separator orientation="vertical" className="h-6 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={isHeadingActive(editor, 1) ? 'is-active' : ''}
        title="Heading 1"
      >
        <Heading1 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={isHeadingActive(editor, 2) ? 'is-active' : ''}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={isHeadingActive(editor, 3) ? 'is-active' : ''}
        title="Heading 3"
      >
        <Heading3 size={18} />
      </button>

      <Separator orientation="vertical" className="h-6 mx-1" />

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

      <Separator orientation="vertical" className="h-6 mx-1" />

      <button
        onClick={() => {
          const { from, to } = editor.state.selection;
          const selectedText = editor.state.doc.textBetween(from, to, ' ');
          
          // Check if link is active and get the href
          const isLinkActive = editor.isActive('link');
          const currentHref = isLinkActive ? editor.getAttributes('link').href : '';
          
          // Prompt text based on whether we're updating or creating a new link
          const promptText = isLinkActive 
            ? `Update link URL (current: ${currentHref})` 
            : 'Enter URL for link';
          
          // Show the prompt with the current URL if available
          const url = window.prompt(promptText, isLinkActive ? currentHref : 'https://');
          
          // Handle different cases based on user input
          if (url === null) {
            // User canceled the prompt
            return;
          } else if (url === '') {
            // User cleared the URL, remove the link
            editor.chain().focus().unsetLink().run();
          } else {
            // User provided a URL
            if (selectedText || isLinkActive) {
              // Apply to selection or update existing link
              editor.chain().focus().setLink({ href: url }).run();
            } else {
              // No selection and not on a link - insert the URL as a link
              editor.chain().focus().insertContent(`<a href="${url}">${url}</a>`).run();
            }
          }
        }}
        className={editor.isActive('link') ? 'is-active' : ''}
        title="Link"
      >
        <Link size={18} />
      </button>

      <Separator orientation="vertical" className="h-6 mx-1" />

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

      <Separator orientation="vertical" className="h-6 mx-1" />

      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal Rule"
      >
        <Minus size={18} />
      </button>
    </div>
  );
}
