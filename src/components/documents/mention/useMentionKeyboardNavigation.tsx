
import { useEffect } from 'react';
import { MentionItem } from '../MentionSelector';

interface UseMentionKeyboardNavigationProps {
  suggestions: MentionItem[];
  isLoading: boolean;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  onSelect: (item: MentionItem) => void;
  onClose: () => void;
}

export const useMentionKeyboardNavigation = ({
  suggestions,
  isLoading,
  selectedIndex,
  setSelectedIndex,
  onSelect,
  onClose
}: UseMentionKeyboardNavigationProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!suggestions.length && !isLoading) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          // Calculate the new index directly instead of using a function
          const nextIndex = selectedIndex < suggestions.length - 1 ? selectedIndex + 1 : selectedIndex;
          setSelectedIndex(nextIndex);
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          // Calculate the new index directly instead of using a function
          const prevIndex = selectedIndex > 0 ? selectedIndex - 1 : selectedIndex;
          setSelectedIndex(prevIndex);
          break;
          
        case 'Enter':
          e.preventDefault();
          if (suggestions[selectedIndex]) {
            onSelect(suggestions[selectedIndex]);
          }
          break;
          
        case 'Tab':
          e.preventDefault();
          if (suggestions[selectedIndex]) {
            onSelect(suggestions[selectedIndex]);
          }
          break;
          
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [suggestions, selectedIndex, onSelect, onClose, isLoading, setSelectedIndex]);
};
