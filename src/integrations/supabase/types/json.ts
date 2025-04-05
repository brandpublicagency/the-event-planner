
import { Json as BaseJson } from './base';

export type Json = BaseJson;

// Define mention types
export interface JsonMention {
  id: string;
  type: 'document' | 'task' | 'event' | 'user';
}

// Helper functions to convert between JsonMention[] and Json
export const mentionsToJson = (mentions: JsonMention[]): Json => {
  return mentions as unknown as Json;
};

export const jsonToMentions = (json: Json): JsonMention[] => {
  if (!json) return [];
  if (Array.isArray(json)) {
    // Cast with type assertion after checking it's an array
    return (json as any[]).map(item => ({
      id: item.id || '',
      type: item.type || 'document'
    })) as JsonMention[];
  }
  return [];
};
