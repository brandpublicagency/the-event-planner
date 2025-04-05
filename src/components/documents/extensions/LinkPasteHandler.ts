
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Slice } from '@tiptap/pm/model';

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

// Regular expression for matching URLs in pasted text
const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}\/[^\s]+)/g;

export const LinkPasteHandler = Extension.create({
  name: 'linkPasteHandler',

  addProseMirrorPlugins() {
    const plugin = new Plugin({
      key: new PluginKey('linkPasteHandler'),
      props: {
        handlePaste: (view, event, slice) => {
          const { state, dispatch } = view;
          const pastedText = slice.content.textBetween(0, slice.content.size, '\n');
          
          // Check for URLs in pasted text
          const urlMatches = pastedText.match(urlRegex);
          
          if (!urlMatches) return false;
          
          // Process the first URL found
          const url = urlMatches[0];
          
          if (!isValidUrl(url)) return false;
          
          // Insert a link preview at current position
          dispatch(state.tr.replaceSelectionWith(
            state.schema.nodes.linkPreview.create({ url })
          ));
          
          return true;
        }
      }
    });
    
    return [plugin];
  }
});
