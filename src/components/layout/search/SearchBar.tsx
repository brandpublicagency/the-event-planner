
import React, { useState, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchQuery } from "./useSearchQuery";
import { SearchResults } from "./SearchResults";
import { MinCharactersNotice } from "./MinCharactersNotice";
import { useDebounce } from "@/hooks/useDebounce";

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // Increased debounce time
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const {
    isLoading,
    filteredResults
  } = useSearchQuery(debouncedSearchQuery);
  
  const clearSearch = () => {
    setSearchQuery("");
  };
  
  // Handle clicks outside the search results to close them
  const handleBlur = (e: React.FocusEvent) => {
    // Delay to allow click on results
    setTimeout(() => {
      // Skip blur if clicking within the results panel
      if (resultsRef.current && resultsRef.current.contains(e.relatedTarget as Node)) {
        return;
      }
      setIsFocused(false);
    }, 200);
  };
  
  return (
    <div className="relative w-64">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      
      <Input 
        placeholder="Search..." 
        value={searchQuery} 
        onChange={e => setSearchQuery(e.target.value)} 
        onFocus={() => setIsFocused(true)} 
        onBlur={handleBlur}
        className="pl-10 pr-8 bg-muted border-border focus-visible:ring-0 rounded-md" 
      />
      
      {searchQuery && (
        <button className="absolute right-3 top-2.5" onClick={clearSearch}>
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
      
      {/* Show search results if focused and has query */}
      {isFocused && searchQuery && searchQuery.length >= 2 && (
        <div ref={resultsRef}>
          <SearchResults isLoading={isLoading} searchResults={filteredResults} />
        </div>
      )}
      
      {/* Minimum Characters Notice */}
      {isFocused && searchQuery && searchQuery.length < 2 && <MinCharactersNotice />}
    </div>
  );
};
