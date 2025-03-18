
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, parse, isValid } from "date-fns";
import { SearchResult } from "./types";

export const useSearchQuery = (searchQuery: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const { toast } = useToast();

  // Parse date from search query
  const parseDateFromQuery = (query: string): Date | null => {
    // Try different date formats
    const dateFormats = [
      'd MMMM', // 5 April
      'd MMM',  // 5 Apr
      'MMMM d', // April 5
      'MMM d',  // Apr 5
      'd/M',    // 5/4
      'M/d',    // 4/5
      'd-M',    // 5-4
      'M-d',    // 4-5
    ];

    const year = new Date().getFullYear();
    
    for (const dateFormat of dateFormats) {
      try {
        // Add the current year for proper parsing
        const dateWithYear = query.includes(String(year)) 
          ? query 
          : `${query} ${year}`;
        
        const parsedDate = parse(
          dateWithYear,
          `${dateFormat} yyyy`,
          new Date()
        );
        
        if (isValid(parsedDate)) {
          return parsedDate;
        }
      } catch (e) {
        // Try next format if this one fails
        continue;
      }
    }
    
    return null;
  };

  // Perform search when query changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      
      try {
        // Check if the search query might be a date
        const possibleDate = parseDateFromQuery(searchQuery);
        
        if (possibleDate && isValid(possibleDate)) {
          // Format the date to ISO format for database query (YYYY-MM-DD)
          const formattedDate = format(possibleDate, 'yyyy-MM-dd');
          
          // Fetch events by date
          const { data: dateEvents, error: dateError } = await supabase
            .from('events')
            .select('event_code, name, event_type, event_date')
            .eq('event_date', formattedDate)
            .is('deleted_at', null)
            .order('event_date', { ascending: true });
            
          if (dateError) throw dateError;
          
          // Format date search results
          const formattedDateEvents = dateEvents?.map(event => ({
            id: event.event_code,
            title: `${event.name} (${event.event_type})`,
            path: `/events/${event.event_code}`,
            type: 'event' as const
          })) || [];
          
          // If we found date results, return them directly
          if (formattedDateEvents.length > 0) {
            setSearchResults(formattedDateEvents);
            setIsLoading(false);
            return;
          } 
          
          // If no events on that date, show a "no events" result
          if (possibleDate) {
            const displayDate = format(possibleDate, 'd MMMM yyyy');
            setSearchResults([{
              id: 'no-events',
              title: `No events scheduled on ${displayDate}`,
              path: `/calendar`,
              type: 'event' as const
            }]);
            setIsLoading(false);
            return;
          }
        }
        
        // Continue with regular search if no date was found or no events on that date
        // Fetch events
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select('event_code, name, event_type, event_date')
          .ilike('name', `%${searchQuery}%`)
          .is('deleted_at', null)
          .order('event_date', { ascending: true })
          .limit(5);
          
        if (eventsError) throw eventsError;
        
        // Fetch contacts by primary name (bride or corporate contact)
        const { data: primaryContacts, error: primaryError } = await supabase
          .from('events')
          .select('event_code, name, primary_name')
          .ilike('primary_name', `%${searchQuery}%`)
          .is('deleted_at', null)
          .limit(3);
          
        if (primaryError) throw primaryError;
        
        // Fetch contacts by secondary name (groom)
        const { data: secondaryContacts, error: secondaryError } = await supabase
          .from('events')
          .select('event_code, name, secondary_name')
          .ilike('secondary_name', `%${searchQuery}%`)
          .is('deleted_at', null)
          .limit(3);
          
        if (secondaryError) throw secondaryError;
        
        // Fetch contacts by company name
        const { data: companyContacts, error: companyError } = await supabase
          .from('events')
          .select('event_code, name, company')
          .ilike('company', `%${searchQuery}%`)
          .is('deleted_at', null)
          .limit(3);
          
        if (companyError) throw companyError;
        
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
        
        const formattedPrimaryContacts = primaryContacts?.map(contact => ({
          id: `primary-${contact.event_code}`,
          title: `${contact.primary_name} (${contact.name})`,
          path: `/contacts`,
          type: 'contact' as const
        })) || [];
        
        const formattedSecondaryContacts = secondaryContacts?.map(contact => ({
          id: `secondary-${contact.event_code}`,
          title: `${contact.secondary_name} (${contact.name})`,
          path: `/contacts`,
          type: 'contact' as const
        })) || [];
        
        const formattedCompanyContacts = companyContacts?.map(contact => ({
          id: `company-${contact.event_code}`,
          title: `${contact.company} (${contact.name})`,
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
          ...formattedPrimaryContacts,
          ...formattedSecondaryContacts,
          ...formattedCompanyContacts,
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

  return {
    isLoading,
    filteredResults: searchResults
  };
};
