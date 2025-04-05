
import { Extension } from '@tiptap/core';

export const isValidUrl = (url: string): boolean => {
  try {
    // Try to create a URL object
    new URL(url);
    return true;
  } catch (e) {
    // If URL throws an error, it's not a valid URL
    try {
      // Try with https:// prefix
      new URL(`https://${url}`);
      return true;
    } catch (e) {
      return false;
    }
  }
};

export const LinkPasteHandler = Extension.create({
  name: 'linkPasteHandler',

  addPasteRules() {
    return [
      {
        type: 'text',
        priority: 100,
        regexp: /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}\/[^\s]+)/g,
        handler: ({ state, range, match, chain }) => {
          // Get the matched URL
          const url = match[0];
          
          if (!isValidUrl(url)) return false;
          
          // Add link preview using the detected URL
          chain()
            .deleteRange(range)
            .setLinkPreview({ url });
          
          return true;
        },
      },
    ];
  },
});
