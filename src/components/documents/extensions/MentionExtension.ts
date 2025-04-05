
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { createTributeInstance } from './mention/tributeConfig';
import { attachMentionClickHandler, attachMentionTooltipHandler, attachTabHandler } from './mention/handlers';
import '../mention.css';

export const MentionExtension = Extension.create({
  name: 'mentions',

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'mention',
      },
      suggestionClass: 'mention-suggestion',
    };
  },

  addProseMirrorPlugins() {
    const plugin = new Plugin({
      key: new PluginKey('mentions'),
      view: (editorView) => {
        // Create tribute instance
        const tribute = createTributeInstance();

        // Find the editable DOM element
        const editorDOM = editorView.dom;
        if (editorDOM) {
          // Attach tribute to the editor
          tribute.attach(editorDOM);
          
          // Add event handlers
          attachTabHandler(editorDOM, editorView);
          attachMentionClickHandler(editorDOM);
          attachMentionTooltipHandler(editorDOM);
        }

        return {
          destroy: () => {
            if (editorDOM) {
              tribute.detach(editorDOM);
            }
          },
        };
      },
    });

    return [plugin];
  },
});
