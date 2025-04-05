import { forwardRef } from 'react';

export interface MentionItem {
  id: string;
  label: string;
  type: 'document' | 'task' | 'event' | 'user';
}

// This component is not used directly anymore, but we keep it for the types
export const MentionSelector = forwardRef<HTMLDivElement, any>((props, ref) => {
  return null;
});

MentionSelector.displayName = 'MentionSelector';
