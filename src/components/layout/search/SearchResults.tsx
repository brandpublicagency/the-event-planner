
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { SearchResultItem } from "./SearchResultItem";
import { SearchResult } from "./types";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchResultsProps {
  isLoading: boolean;
  searchResults: SearchResult[];
}

export const SearchResults: React.FC<SearchResultsProps> = ({ isLoading, searchResults }) => {
  const navigate = useNavigate();
  
  const handleResultClick = useCallback((path: string, e: React.MouseEvent) => {
    // Prevent default to avoid triggering form submission
    e.preventDefault();
    e.stopPropagation();
    
    // Use navigate instead of direct location change to prevent full page reload
    navigate(path);
  }, [navigate]);
  
  return (
    <div className="absolute top-full mt-1 w-full bg-white rounded-md border border-zinc-200 shadow-md z-10 overflow-hidden">
      <div className="max-h-[300px] overflow-y-auto py-1">
        {isLoading ? (
          <div className="flex flex-col space-y-2 px-3 py-2">
            <div className="flex items-center justify-center py-2">
              <Loader2 className="h-4 w-4 text-muted-foreground animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">Searching...</span>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2">
                <Skeleton className="h-2 w-2 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : searchResults.length > 0 ? (
          searchResults.map((result) => (
            <SearchResultItem 
              key={`${result.type}-${result.id}`}
              result={result}
              onClick={(e) => handleResultClick(result.path, e)}
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
