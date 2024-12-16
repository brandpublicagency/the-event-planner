import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';

const lowlight = createLowlight(common);

// Create a custom extension for handling URL pastes
const PasteUrlHandler = Extension.create({
  name: 'pasteUrlHandler',

  addProseMirrorPlugins() {
    const urlHandlerKey = new PluginKey('pasteUrlHandler');
    
    return [
      new Plugin({
        key: urlHandlerKey,
        props: {
          handlePaste: (view: EditorView, event: ClipboardEvent) => {
            const text = event.clipboardData?.getData('text/plain');
            if (!text) return false;

            // Check if the text is a URL
            try {
              const url = new URL(text);
              
              // Insert the link immediately
              const { tr } = view.state;
              const link = view.state.schema.marks.link.create({ href: text });
              view.dispatch(tr.replaceSelectionWith(
                view.state.schema.text(text),
                false
              ).addMark(tr.selection.from, tr.selection.from + text.length, link));

              // Start async preview fetch
              fetch(`/api/fetch-link-preview?url=${encodeURIComponent(text)}`)
                .then(response => response.json())
                .then(preview => {
                  if (preview.title) {
                    const previewText = `${preview.title}\n${text}`;
                    const newTr = view.state.tr.replaceWith(
                      tr.selection.from - text.length,
                      tr.selection.from,
                      view.state.schema.text(previewText)
                    ).addMark(
                      tr.selection.from - text.length,
                      tr.selection.from - text.length + previewText.length,
                      link
                    );
                    view.dispatch(newTr);
                  }
                })
                .catch(error => {
                  console.error('Error fetching link preview:', error);
                });

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
    autolink: true,
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