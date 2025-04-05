
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
    return json as JsonMention[];
  }
  return [];
};
