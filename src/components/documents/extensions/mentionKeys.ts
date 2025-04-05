
import { PluginKey } from '@tiptap/pm/state';

// Create dedicated plugin keys for different mention types
export const mentionSuggestionKey = new PluginKey('mentionSuggestion');
export const taskMentionKey = new PluginKey('taskMention');
export const eventMentionKey = new PluginKey('eventMention');
export const userMentionKey = new PluginKey('userMention');
export const documentMentionKey = new PluginKey('documentMention');
