
/**
 * Utility functions for kitchen menu printing
 */
import { format, parseISO } from 'date-fns';
import { Event } from '@/types/event';
import { getVenueNames } from '@/utils/venueUtils';
import React from 'react';
import { getMenuItemDescription } from './menuItemDescriptions';

// Clean item descriptions by replacing underscores with spaces
export const cleanItemDescription = (description: string) => {
  return description.replace(/_/g, ' ');
};

// Format date
export const formatDate = (dateString: string | null) => {
  if (!dateString) return 'No date';
  return format(new Date(dateString), 'dd MMMM yyyy');
};

// Format time 
export const formatTimeDisplay = (startTime: string | null, endTime: string | null) => {
  if (!startTime || !endTime) return '';
  
  const formattedStart = format(parseISO(`2000-01-01T${startTime}`), 'HH:mm');
  const formattedEnd = format(parseISO(`2000-01-01T${endTime}`), 'HH:mm');
  
  return `${formattedStart} - ${formattedEnd}`;
};

// Format notes
export const formatNotes = (notes: string): React.ReactNode[] => {
  return notes.split('\n').map((line, i) => 
    React.createElement('p', {
      key: i,
      style: { fontSize: '12px', margin: '0', marginBottom: '4px' }
    }, line)
  );
};

// Get event header info
export const getEventHeaderInfo = (event: Event) => {
  return {
    name: event.name,
    date: formatDate(event.event_date),
    time: formatTimeDisplay(event.start_time, event.end_time),
    pax: event.pax,
    eventType: event.event_type || 'Private Event',
    venueNames: getVenueNames(event)
  };
};
