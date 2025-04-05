
// This file now just re-exports from the smaller files
import { MentionNode, MentionOptions } from './extensions/MentionNode';
import { MentionCommands } from './extensions/MentionCommands';
import { DirectMentionExtensions } from './extensions/DirectMentionExtensions';
import { TabKeyHandler, SlashKeyHandler } from './extensions/KeyHandlers';
import { 
  mentionSuggestionKey, 
  taskMentionKey, 
  eventMentionKey, 
  userMentionKey, 
  documentMentionKey 
} from './extensions/mentionKeys';

export { 
  MentionNode, 
  MentionCommands, 
  DirectMentionExtensions, 
  TabKeyHandler,
  SlashKeyHandler,
  mentionSuggestionKey, 
  taskMentionKey, 
  eventMentionKey, 
  userMentionKey, 
  documentMentionKey 
};

export type { MentionOptions };
