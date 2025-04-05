
// Define types for mention functionality
export interface MentionResult {
  id: string;
  title: string;
  type: 'event' | 'task' | 'document' | 'user';
  url: string;
  icon?: string;
  color?: string;
}

export interface MentionGroup {
  type: string;
  label: string;
  icon: string;
  color: string;
}
