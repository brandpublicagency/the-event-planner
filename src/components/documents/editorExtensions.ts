import { Node } from '@tiptap/core';
import { Plugin } from 'prosemirror-state';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';

const lowlight = createLowlight(common);

// Create a paste handler extension
export const PasteHandler = Node.create({
  name: 'pasteHandler',
  group: 'block',
  atom: true,

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handlePaste: (view, event) => {
            const text = event.clipboardData?.getData('text/plain');
            if (!text) return false;
            
            // Check if the text is a URL
            if (/^https?:\/\//.test(text.trim())) {
              // Insert both the link and a paragraph node for the preview
              const { tr } = view.state;
              
              // Create the link
              this.editor.commands.setLink({ href: text });
              
              // Insert a new paragraph with the preview component
              const previewNode = this.editor.schema.nodes.paragraph.create(
                null,
                this.editor.schema.text(`<link-preview url="${text}">`)
              );
              
              tr.insert(tr.selection.to, previewNode);
              view.dispatch(tr);
              
              return true;
            }
            return false;
          },
        },
      }),
    ];
  },
});

// Export all extensions
export const getEditorExtensions = () => [
  StarterKit,
  Underline,
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'text-primary underline decoration-primary cursor-pointer',
    },
  }),
  Highlight.configure({
    multicolor: false,
  }),
  CodeBlockLowlight.configure({
    lowlight,
  }),
  PasteHandler,
];