
import { Extension } from '@tiptap/core';
import { RawCommands } from '@tiptap/core';

// Create the setMention command extension
export const MentionCommands = Extension.create({
  name: 'mentionCommands',
  
  addCommands() {
    return {
      setMention: (attrs) => ({ commands }) => {
        console.log('setMention command called with attrs:', attrs);
        return commands.insertContent({
          type: 'mention',
          attrs
        });
      }
    } as Partial<RawCommands>;
  }
});
