
import { Extension } from '@tiptap/core';
import { Suggestion } from '@tiptap/suggestion';
import { createMentionClickPlugin } from './MentionClickPlugin';
import { createMentionTooltipPlugin } from './MentionTooltipPlugin';
import { MentionSuggestionConfig } from './MentionSuggestion';

export const MentionExtension = Extension.create({
  name: 'mentionSuggestion',

  addOptions() {
    return {
      suggestion: MentionSuggestionConfig,
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
      createMentionClickPlugin(),
      createMentionTooltipPlugin(),
    ];
  },
});
