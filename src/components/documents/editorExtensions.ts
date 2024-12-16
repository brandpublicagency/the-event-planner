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
            try {
              const url = new URL(text);
              if (url.protocol === 'http:' || url.protocol === 'https:') {
                const { tr } = view.state;
                
                // Create a paragraph node with the link mark
                const linkMark = view.state.schema.marks.link.create({ href: text });
                const paragraph = view.state.schema.nodes.paragraph.create(
                  null,
                  view.state.schema.text(text, [linkMark])
                );
                
                // Insert the paragraph with the link
                tr.replaceSelectionWith(paragraph);
                
                // Insert the preview placeholder in a new paragraph
                const previewText = `<link-preview url="${text}">`;
                const previewParagraph = view.state.schema.nodes.paragraph.create(
                  null,
                  view.state.schema.text(previewText)
                );
                
                // Add two newlines and the preview
                tr.insert(tr.selection.to, view.state.schema.nodes.paragraph.create())
                  .insert(tr.selection.to + 1, previewParagraph)
                  .insert(tr.selection.to + 2, view.state.schema.nodes.paragraph.create());
                
                view.dispatch(tr.scrollIntoView());
                return true;
              }
            } catch (e) {
              // Not a valid URL, let the default paste handler take over
              return false;
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
  StarterKit.configure({
    codeBlock: false, // Disable the default code block to avoid conflicts
  }),
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