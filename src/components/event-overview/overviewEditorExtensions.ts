import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';

// Simplified extensions for overview editors (no mentions, link previews)
export const getOverviewEditorExtensions = () => [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3]
    },
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
];
