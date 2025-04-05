
import React from 'react';
import { MentionItem } from '../MentionSelector';
import { MentionSuggestionItem } from './MentionSuggestionItem';

interface MentionSuggestionListProps {
  suggestions: MentionItem[];
  selectedIndex: number;
  onSelect: (item: MentionItem) => void;
}

export const MentionSuggestionList: React.FC<MentionSuggestionListProps> = ({
  suggestions,
  selectedIndex,
  onSelect
}) => {
  return (
    <div 
      className="inline-flex flex-col max-h-[120px] overflow-auto bg-white bg-opacity-90 rounded-md shadow-sm border border-gray-200" 
      style={{
        width: 'auto',
        height: suggestions.length > 5 ? '120px' : 'auto'
      }}
    >
      {suggestions.map((item, index) => (
        <MentionSuggestionItem
          key={`${item.type}-${item.id}`}
          item={item}
          isSelected={index === selectedIndex}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};
