
import React from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { SearchResultItem } from "./SearchResultItem";
import { SearchResult } from "./types";

interface SearchResultsProps {
  isLoading: boolean;
  searchResults: SearchResult[];
}

export const SearchResults: React.FC<SearchResultsProps> = ({ isLoading, searchResults }) => {
  const navigate = useNavigate();
  
  const handleResultClick = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="absolute top-full mt-1 w-full bg-white rounded-md border border-zinc-200 shadow-md z-10 overflow-hidden">
      <div className="max-h-[300px] overflow-y-auto py-1">
        {isLoading ? (
          <div className="px-3 py-4 text-sm text-center text-muted-foreground">
            Searching...
          </div>
        ) : searchResults.length > 0 ? (
          searchResults.map((result) => (
            <SearchResultItem 
              key={`${result.type}-${result.id}`}
              result={result}
              onClick={() => handleResultClick(result.path)}
            />
          ))
        ) : (
          <div className="p-3 text-sm text-muted-foreground text-center">
            No results found
          </div>
        )}
      </div>
    </div>
  );
};
