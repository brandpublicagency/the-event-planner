
import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  title: string;
  path: string;
  type: 'event' | 'contact' | 'document' | 'task';
}

// This would normally come from a backend API or context
const mockSearchResults: SearchResult[] = [
  { title: "Wedding: Sarah & John", path: "/events/1", type: "event" },
  { title: "Corporate Meeting: XYZ Corp", path: "/events/2", type: "event" },
  { title: "Sarah Johnson", path: "/contacts/1", type: "contact" },
  { title: "Client Agreement Template", path: "/documents/1", type: "document" },
  { title: "Follow up with venue", path: "/tasks/1", type: "task" },
];

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const filteredResults = searchQuery.length > 0
    ? mockSearchResults.filter(result => 
        result.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
    
  const handleResultClick = (path: string) => {
    setSearchQuery("");
    setIsFocused(false);
    navigate(path);
  };

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
      
      {/* Search Results Dropdown */}
      {isFocused && searchQuery && filteredResults.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white rounded-md border border-zinc-200 shadow-md z-10 overflow-hidden">
          <div className="max-h-[300px] overflow-y-auto py-1">
            {filteredResults.map((result, index) => (
              <div 
                key={index}
                className="px-3 py-2 hover:bg-zinc-50 cursor-pointer flex items-center"
                onMouseDown={() => handleResultClick(result.path)}
              >
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  result.type === 'event' ? 'bg-blue-500' : 
                  result.type === 'contact' ? 'bg-green-500' : 
                  result.type === 'document' ? 'bg-amber-500' : 
                  'bg-purple-500'
                }`} />
                <div>
                  <div className="text-sm font-medium">{result.title}</div>
                  <div className="text-xs text-muted-foreground capitalize">{result.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* No Results Message */}
      {isFocused && searchQuery && filteredResults.length === 0 && (
        <div className="absolute top-full mt-1 w-full bg-white rounded-md border border-zinc-200 shadow-md z-10">
          <div className="p-3 text-sm text-muted-foreground text-center">
            No results found
          </div>
        </div>
      )}
    </div>
  );
};
