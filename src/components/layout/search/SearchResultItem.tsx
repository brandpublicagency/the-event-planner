
import React from "react";
import { SearchResult } from "./types";

interface SearchResultItemProps {
  result: SearchResult;
  onClick: (e: React.MouseEvent) => void;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({ result, onClick }) => {
  return (
    <div 
      className="px-3 py-2 hover:bg-zinc-50 cursor-pointer flex items-center"
      onMouseDown={(e) => onClick(e)}
    >
      <div className={`w-2 h-2 rounded-full mr-2 ${
        result.type === 'event' ? 'bg-blue-500' : 
        result.type === 'contact' ? 'bg-green-500' : 
        result.type === 'document' ? 'bg-amber-500' : 
        'bg-purple-500'
      }`} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{result.title}</div>
        <div className="text-xs text-muted-foreground capitalize">{result.type}</div>
      </div>
    </div>
  );
};
