import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, parse, isValid } from "date-fns";
import { SearchResult } from "./types";

export const useSearchQuery = (searchQuery: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const previousResultsRef = useRef<SearchResult[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowLoadingIndicator(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowLoadingIndicator(false);
    }
  }, [isLoading]);

  const parseDateFromQuery = (query: string): Date | null => {
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
        continue;
      }
    }
    
    return null;
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      
      try {
        const previousResults = previousResultsRef.current;
        
        const eventCodeSearch = searchQuery.trim().toUpperCase();
        
        if (/^[A-Z]+-\d+-\d+$/.test(eventCodeSearch) || 
            /^[A-Z]+-\d+$/.test(eventCodeSearch)) {
          const { data: exactEvents, error: exactError } = await supabase
            .from('events')
            .select('event_code, name, event_type, event_date')
            .eq('event_code', eventCodeSearch)
            .is('deleted_at', null)
            .limit(1);
            
          if (exactError) throw exactError;
          
          if (exactEvents && exactEvents.length > 0) {
            const formattedExactEvents = exactEvents.map(event => ({
              id: event.event_code,
              title: `${event.name} (${event.event_code})`,
              path: `/events/${event.event_code}`,
              type: 'event' as const
            }));
            
            setSearchResults(formattedExactEvents);
            previousResultsRef.current = formattedExactEvents;
            setIsLoading(false);
            return;
          }
        }
        
        const possibleDate = parseDateFromQuery(searchQuery);
        
        if (possibleDate && isValid(possibleDate)) {
          const formattedDate = format(possibleDate, 'yyyy-MM-dd');
          
          const { data: dateEvents, error: dateError } = await supabase
            .from('events')
            .select('event_code, name, event_type, event_date')
            .eq('event_date', formattedDate)
            .is('deleted_at', null)
            .order('event_date', { ascending: true });
            
          if (dateError) throw dateError;
          
          const formattedDateEvents = dateEvents?.map(event => ({
            id: event.event_code,
            title: `${event.name} (${event.event_type})`,
            path: `/events/${event.event_code}`,
            type: 'event' as const
          })) || [];
          
          if (formattedDateEvents.length > 0) {
            setSearchResults(formattedDateEvents);
            setIsLoading(false);
            return;
          } 
          
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
        
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select('event_code, name, event_type, event_date')
          .or(`name.ilike.%${searchQuery}%,event_code.ilike.%${searchQuery}%`)
          .is('deleted_at', null)
          .order('event_date', { ascending: true })
          .limit(5);
          
        if (eventsError) throw eventsError;
        
        const { data: primaryContacts, error: primaryError } = await supabase
          .from('events')
          .select('event_code, name, primary_name')
          .ilike('primary_name', `%${searchQuery}%`)
          .is('deleted_at', null)
          .limit(3);
          
        if (primaryError) throw primaryError;
        
        const { data: secondaryContacts, error: secondaryError } = await supabase
          .from('events')
          .select('event_code, name, secondary_name')
          .ilike('secondary_name', `%${searchQuery}%`)
          .is('deleted_at', null)
          .limit(3);
          
        if (secondaryError) throw secondaryError;
        
        const { data: companyContacts, error: companyError } = await supabase
          .from('events')
          .select('event_code, name, company')
          .ilike('company', `%${searchQuery}%`)
          .is('deleted_at', null)
          .limit(3);
          
        if (companyError) throw companyError;
        
        const { data: documents, error: documentsError } = await supabase
          .from('documents')
          .select('id, title')
          .ilike('title', `%${searchQuery}%`)
          .is('deleted_at', null)
          .limit(3);
          
        if (documentsError) throw documentsError;
        
        const { data: tasks, error: tasksError } = await supabase
          .from('tasks')
          .select('id, title')
          .ilike('title', `%${searchQuery}%`)
          .limit(3);
          
        if (tasksError) throw tasksError;
        
        const formattedEvents = events?.map(event => ({
          id: event.event_code,
          title: `${event.name} (${event.event_code})`,
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
        
        const combinedResults = [
          ...formattedEvents, 
          ...formattedPrimaryContacts,
          ...formattedSecondaryContacts,
          ...formattedCompanyContacts,
          ...formattedDocuments, 
          ...formattedTasks
        ];
        
        setSearchResults(combinedResults);
        previousResultsRef.current = combinedResults;
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
    
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        fetchSearchResults();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, toast]);

  return {
    isLoading: showLoadingIndicator,
    filteredResults: searchResults
  };
};
