
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { LinkPreviewNode } from './LinkPreviewExtension';
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

const lowlight = createLowlight(common);

// URL matching regex
const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

// Create a paste handler extension
const PasteHandler = Extension.create({
  name: 'pasteHandler',
  
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('pasteHandler'),
        props: {
          handlePaste: (view, event) => {
            const clipboardText = event.clipboardData?.getData('text/plain');
            if (!clipboardText) return false;
            
            // Check if the clipboard text is a URL
            if (urlRegex.test(clipboardText)) {
              const url = clipboardText.match(urlRegex)?.[0];
              if (url) {
                // If there's selected text, apply the link to it instead of creating a preview
                const { from, to } = view.state.selection;
                const selectedText = view.state.doc.textBetween(from, to, ' ');
                
                if (selectedText) {
                  // Create a link around the selected text
                  const { tr } = view.state;
                  view.dispatch(
                    tr.replaceSelectionWith(
                      view.state.schema.text(selectedText),
                      false
                    ).addMark(
                      from,
                      from + selectedText.length,
                      view.state.schema.marks.link.create({ href: url })
                    )
                  );
                  return true;
                }
                
                try {
                  // No selection, create a link preview node
                  const node = view.state.schema.nodes.linkPreview.create({ url });
                  
                  // Create a transaction and insert the node
                  const { tr } = view.state;
                  const position = view.state.selection.from;
                  tr.insert(position, node);
                  
                  // Apply the transaction
                  view.dispatch(tr);
                  return true; // Stop propagation
                } catch (err) {
                  console.error("Error inserting link preview:", err);
                  return false;
                }
              }
            }
            
            return false; // Allow other paste handlers to continue
          }
        }
      })
    ];
  }
});

// Export all extensions
export const getEditorExtensions = () => [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3]
    },
    codeBlock: false, // Disable the default code block to avoid conflicts
  }),
  Underline,
  Link.configure({
    openOnClick: true, // Open links on click
    HTMLAttributes: {
      class: 'text-primary underline decoration-primary cursor-pointer',
      rel: 'noopener noreferrer', // Security best practice for external links
      target: '_blank', // Open links in new tab
    },
    autolink: true, // Automatically convert URLs to links
    validate: href => /^https?:\/\//.test(href), // Only allow http/https links
    linkOnPaste: true, // Convert pasted URLs to links
  }),
  Highlight.configure({
    multicolor: false,
  }),
  CodeBlockLowlight.configure({
    lowlight,
  }),
  LinkPreviewNode,
  PasteHandler, // Add the paste handler extension
];

// Helper function to check if mark is active
export const isMarkActive = (editor: any, type: string) => {
  return editor.isActive(type);
};

// Helper function to check if heading with specific level is active
export const isHeadingActive = (editor: any, level: number) => {
  return editor.isActive('heading', { level });
};
