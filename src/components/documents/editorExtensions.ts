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
                const linkText = view.state.schema.text(text, [linkMark]);
                const linkParagraph = view.state.schema.nodes.paragraph.create(null, linkText);
                
                // Create a paragraph for the preview
                const previewText = view.state.schema.text(`<link-preview url="${text}">`);
                const previewParagraph = view.state.schema.nodes.paragraph.create(null, previewText);
                
                // Replace selection with link and add preview below
                tr.replaceSelectionWith(linkParagraph)
                  .ensureNewline()
                  .insert(tr.selection.to, previewParagraph)
                  .ensureNewline();
                
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