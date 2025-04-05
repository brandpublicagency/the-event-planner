
import { useEffect } from 'react';
import { MentionItem } from '../MentionSelector';

interface MentionKeyboardNavigationProps {
  suggestions: MentionItem[];
  isLoading: boolean;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  onSelect: (item: MentionItem) => void;
  onClose: () => void;
}

export function useMentionKeyboardNavigation({
  suggestions,
  isLoading,
  selectedIndex,
  setSelectedIndex,
  onSelect,
  onClose
}: MentionKeyboardNavigationProps) {
  // Handle keyboard events for navigating the suggestions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!suggestions.length || isLoading) return;

      // Handle navigation keys
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        // Fixed: Calculate new index directly instead of using a function
        const newIndex = (selectedIndex + 1) % suggestions.length;
        setSelectedIndex(newIndex);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        // Fixed: Calculate new index directly instead of using a function
        const newIndex = (selectedIndex - 1 + suggestions.length) % suggestions.length;
        setSelectedIndex(newIndex);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        e.stopPropagation();
        if (suggestions[selectedIndex]) {
          onSelect(suggestions[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [suggestions, selectedIndex, setSelectedIndex, onSelect, onClose, isLoading]);
}
