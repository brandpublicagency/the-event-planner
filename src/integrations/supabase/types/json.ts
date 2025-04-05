
import { Json } from "./base";

// Re-export Json type to ensure it's available
export { Json } from "./base";

// JSON handling for array types
export function parseJsonArray<T>(json: Json | null): T[] {
  if (!json) return [];
  try {
    if (Array.isArray(json)) return json as T[];
    return [];
  } catch (error) {
    console.error('Error parsing JSON array:', error);
    return [];
  }
}

// JSON mention type
export interface JsonMention {
  id: string;
  type: 'document' | 'task' | 'event' | 'user';
}

// Convert mention array to JSON
export function mentionsToJson(mentions: JsonMention[]): Json {
  return mentions as unknown as Json;
}

// Convert JSON to mention array
export function jsonToMentions(json: Json | null): JsonMention[] {
  return parseJsonArray<JsonMention>(json);
}
