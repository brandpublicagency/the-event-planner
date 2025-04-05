
import React from 'react';
import { MentionItem } from '../MentionSelector';
import { MentionIcon } from './MentionIcon';

interface MentionSuggestionItemProps {
  item: MentionItem;
  isSelected: boolean;
  onSelect: (item: MentionItem) => void;
}

export const MentionSuggestionItem: React.FC<MentionSuggestionItemProps> = ({
  item,
  isSelected,
  onSelect
}) => {
  return (
    <div
      key={`${item.type}-${item.id}`}
      className={`text-xs flex items-center cursor-pointer px-2 py-1 ${
        isSelected ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'
      }`}
      onClick={() => onSelect(item)}
    >
      <span className="mr-1">
        <MentionIcon type={item.type} />
      </span>
      <span className="truncate">{item.label}</span>
    </div>
  );
};
