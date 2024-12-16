import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { Extension } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';

const lowlight = createLowlight(common);

// Create a custom extension for handling URL pastes
const PasteUrlHandler = Extension.create({
  name: 'pasteUrlHandler',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handlePaste: (view, event) => {
            const text = event.clipboardData?.getData('text/plain');
            if (!text) return false;

            // Check if the text is a URL
            try {
              new URL(text);
              // If it's a URL, insert it as a link
              const { tr } = view.state;
              const link = view.state.schema.marks.link.create({ href: text });
              view.dispatch(tr.replaceSelectionWith(
                view.state.schema.text(text),
                false
              ).addMark(tr.selection.from, tr.selection.from + text.length, link));
              return true;
            } catch {
              // If it's not a URL, let the editor handle it normally
              return false;
            }
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
    // Add autolink functionality
    autolink: true,
    // Validate URLs
    validate: href => /^https?:\/\//.test(href),
  }),
  Highlight.configure({
    multicolor: false,
  }),
  CodeBlockLowlight.configure({
    lowlight,
  }),
  PasteUrlHandler,
];