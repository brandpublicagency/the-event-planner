
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const SearchBar = () => {
  return (
    <div className="relative hidden md:block w-64">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input 
        placeholder="Search..." 
        className="pl-10 rounded-full bg-zinc-50 border-zinc-200 focus-visible:ring-0" 
      />
    </div>
  );
};
