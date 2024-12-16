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
                // Insert both the link and the preview
                const { tr } = view.state;
                
                // Insert the URL as a link
                view.dispatch(
                  tr.replaceSelectionWith(
                    view.state.schema.text(text, [
                      view.state.schema.marks.link.create({ href: text })
                    ])
                  )
                );

                // Insert the preview placeholder on a new line
                const previewText = `<link-preview url="${text}">`;
                const pos = view.state.selection.to;
                view.dispatch(
                  view.state.tr
                    .insertText('\n\n' + previewText + '\n', pos)
                    .scrollIntoView()
                );
                
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