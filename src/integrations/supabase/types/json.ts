
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Export a utility type to help with JSON serialization of Mention objects
export type JsonMention = {
  id: string;
  type: string;
};

// Utility functions for type conversion
export const jsonToMentions = (json: Json | null): JsonMention[] => {
  if (!json || !Array.isArray(json)) return [];
  return json as JsonMention[];
};

export const mentionsToJson = (mentions: JsonMention[]): Json => {
  return mentions as unknown as Json;
};
