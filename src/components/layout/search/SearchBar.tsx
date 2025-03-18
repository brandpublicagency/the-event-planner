
import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchQuery } from "./useSearchQuery";
import { SearchResults } from "./SearchResults";
import { MinCharactersNotice } from "./MinCharactersNotice";

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  
  const { 
    isLoading, 
    filteredResults 
  } = useSearchQuery(searchQuery);
  
  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="relative hidden md:block w-64">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      
      <Input 
        placeholder="Search..." 
        className="pl-10 pr-8 rounded-full bg-zinc-50 border-zinc-200 focus-visible:ring-0" 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          // Delay to allow click on results
          setTimeout(() => setIsFocused(false), 200);
        }}
      />
      
      {searchQuery && (
        <button 
          className="absolute right-3 top-2.5"
          onClick={clearSearch}
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
      
      {/* Show search results if focused and has query */}
      {isFocused && searchQuery && searchQuery.length >= 2 && (
        <SearchResults 
          isLoading={isLoading} 
          searchResults={filteredResults} 
        />
      )}
      
      {/* Minimum Characters Notice */}
      {isFocused && searchQuery && searchQuery.length < 2 && (
        <MinCharactersNotice />
      )}
    </div>
  );
};
