
import { Extension } from '@tiptap/core';

// Improved extension for handling slash commands - will work with our inline suggestions
export const DirectMentionExtensions = Extension.create({
  name: 'directMentions',
  
  addProseMirrorPlugins() {
    // Here we're intentionally not adding Suggestion plugins since
    // we'll handle the suggestions with our custom InlineMentionSuggestions component
    return [];
  }
});
