
import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface SearchResult {
  id: string; 
  title: string;
  path: string;
  type: 'event' | 'contact' | 'document' | 'task';
}

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Perform search when query changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      
      try {
        // Fetch events
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select('event_code, name, event_type, event_date')
          .ilike('name', `%${searchQuery}%`)
          .is('deleted_at', null)
          .order('event_date', { ascending: true })
          .limit(5);
          
        if (eventsError) throw eventsError;
        
        // Fetch contacts (from wedding and corporate details)
        const { data: weddingContacts, error: weddingError } = await supabase
          .from('wedding_details')
          .select(`
            event_code,
            bride_name,
            groom_name,
            events!inner(name)
          `)
          .or(`bride_name.ilike.%${searchQuery}%,groom_name.ilike.%${searchQuery}%`)
          .limit(3);
          
        if (weddingError) throw weddingError;
        
        const { data: corporateContacts, error: corporateError } = await supabase
          .from('corporate_details')
          .select(`
            event_code,
            contact_person,
            company_name,
            events!inner(name)
          `)
          .or(`contact_person.ilike.%${searchQuery}%,company_name.ilike.%${searchQuery}%`)
          .limit(3);
          
        if (corporateError) throw corporateError;
        
        // Fetch documents
        const { data: documents, error: documentsError } = await supabase
          .from('documents')
          .select('id, title')
          .ilike('title', `%${searchQuery}%`)
          .is('deleted_at', null)
          .limit(3);
          
        if (documentsError) throw documentsError;
        
        // Fetch tasks
        const { data: tasks, error: tasksError } = await supabase
          .from('tasks')
          .select('id, title')
          .ilike('title', `%${searchQuery}%`)
          .limit(3);
          
        if (tasksError) throw tasksError;
        
        // Format all results
        const formattedEvents = events?.map(event => ({
          id: event.event_code,
          title: event.name,
          path: `/events/${event.event_code}`,
          type: 'event' as const
        })) || [];
        
        const formattedWeddingContacts = weddingContacts?.flatMap(contact => {
          const results: SearchResult[] = [];
          
          if (contact.bride_name && contact.bride_name.toLowerCase().includes(searchQuery.toLowerCase())) {
            results.push({
              id: `bride-${contact.event_code}`,
              title: `${contact.bride_name} (${contact.events.name})`,
              path: `/contacts`,
              type: 'contact'
            });
          }
          
          if (contact.groom_name && contact.groom_name.toLowerCase().includes(searchQuery.toLowerCase())) {
            results.push({
              id: `groom-${contact.event_code}`,
              title: `${contact.groom_name} (${contact.events.name})`,
              path: `/contacts`,
              type: 'contact'
            });
          }
          
          return results;
        }) || [];
        
        const formattedCorporateContacts = corporateContacts?.map(contact => ({
          id: `corporate-${contact.event_code}`,
          title: contact.company_name 
            ? `${contact.contact_person} - ${contact.company_name}`
            : contact.contact_person,
          path: `/contacts`,
          type: 'contact' as const
        })) || [];
        
        const formattedDocuments = documents?.map(doc => ({
          id: doc.id,
          title: doc.title,
          path: `/documents?document=${doc.id}`,
          type: 'document' as const
        })) || [];
        
        const formattedTasks = tasks?.map(task => ({
          id: task.id,
          title: task.title,
          path: `/tasks/${task.id}`,
          type: 'task' as const
        })) || [];
        
        // Combine all results
        const combinedResults = [
          ...formattedEvents, 
          ...formattedWeddingContacts,
          ...formattedCorporateContacts, 
          ...formattedDocuments, 
          ...formattedTasks
        ];
        
        setSearchResults(combinedResults);
      } catch (error) {
        console.error('Search error:', error);
        toast({
          title: "Search failed",
          description: "Could not retrieve search results",
          variant: "destructive",
        });
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Use debouncing to avoid too many requests
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        fetchSearchResults();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, toast]);

  const filteredResults = searchResults;
    
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
      {isFocused && searchQuery && searchQuery.length >= 2 && (
        <div className="absolute top-full mt-1 w-full bg-white rounded-md border border-zinc-200 shadow-md z-10 overflow-hidden">
          <div className="max-h-[300px] overflow-y-auto py-1">
            {isLoading ? (
              <div className="px-3 py-4 text-sm text-center text-muted-foreground">
                Searching...
              </div>
            ) : filteredResults.length > 0 ? (
              filteredResults.map((result) => (
                <div 
                  key={`${result.type}-${result.id}`}
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
              ))
            ) : (
              <div className="p-3 text-sm text-muted-foreground text-center">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Minimum Characters Notice */}
      {isFocused && searchQuery && searchQuery.length < 2 && (
        <div className="absolute top-full mt-1 w-full bg-white rounded-md border border-zinc-200 shadow-md z-10">
          <div className="p-3 text-sm text-muted-foreground text-center">
            Type at least 2 characters to search
          </div>
        </div>
      )}
    </div>
  );
};
