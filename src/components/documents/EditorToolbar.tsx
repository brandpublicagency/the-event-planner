
import { 
  Bold, Italic, Heading1, Heading2, Heading3, 
  List, ListOrdered, Code, Quote, Underline, 
  Highlighter, Minus, AtSign
} from "lucide-react";
import { Editor } from "@tiptap/react";
import { isMarkActive, isHeadingActive } from "./editorExtensions";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EditorToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const insertMention = () => {
    editor.chain().focus().insertContent('@').run();
  };

  return (
    <div className="editor-toolbar">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive('bold') ? 'is-active' : ''}
              title="Bold"
            >
              <Bold size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Bold</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive('italic') ? 'is-active' : ''}
              title="Italic"
            >
              <Italic size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Italic</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive('underline') ? 'is-active' : ''}
              title="Underline"
            >
              <Underline size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Underline</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={editor.isActive('highlight') ? 'is-active' : ''}
              title="Highlight"
            >
              <Highlighter size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Highlight</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={isHeadingActive(editor, 1) ? 'is-active' : ''}
              title="Heading 1"
            >
              <Heading1 size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Heading 1</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={isHeadingActive(editor, 2) ? 'is-active' : ''}
              title="Heading 2"
            >
              <Heading2 size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Heading 2</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={isHeadingActive(editor, 3) ? 'is-active' : ''}
              title="Heading 3"
            >
              <Heading3 size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Heading 3</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive('bulletList') ? 'is-active' : ''}
              title="Bullet List"
            >
              <List size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Bullet List</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive('orderedList') ? 'is-active' : ''}
              title="Ordered List"
            >
              <ListOrdered size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Ordered List</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={editor.isActive('codeBlock') ? 'is-active' : ''}
              title="Code Block"
            >
              <Code size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Code Block</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={editor.isActive('blockquote') ? 'is-active' : ''}
              title="Quote"
            >
              <Quote size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Quote</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="Horizontal Rule"
            >
              <Minus size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Horizontal Rule</TooltipContent>
        </Tooltip>
        
        <Separator orientation="vertical" className="h-6 mx-1" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={insertMention}
              title="Mention"
            >
              <AtSign size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Mention (@)</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
