
import { Extension } from '@tiptap/core';
import { Suggestion } from '@tiptap/suggestion';
import { PluginKey } from '@tiptap/pm/state';
import { createMentionClickPlugin } from './MentionClickPlugin';
import { createMentionTooltipPlugin } from './MentionTooltipPlugin';
import { MentionSuggestionConfig } from './MentionSuggestion';

const MentionSuggestionPluginKey = new PluginKey('mentionSuggestion');

export const MentionExtension = Extension.create({
  name: 'mentionSuggestion',

  addOptions() {
    return {
      suggestion: {
        ...MentionSuggestionConfig,
        pluginKey: MentionSuggestionPluginKey,
      },
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
