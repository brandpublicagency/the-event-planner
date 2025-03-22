
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventFormSchema } from '@/schemas/eventFormSchema';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { EventFormData } from '@/types/eventForm';
import EditEventForm from '@/components/forms/EditEventForm';

const NewEvent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema) as any,
    defaultValues: {
      name: '',
      event_type: 'Wedding',
      event_date: undefined,
      start_time: '',
      end_time: '',
      client_address: '',
      venues: [],
      pax: undefined,
      description: '',
      
      // Contact fields
      primary_name: '',
      primary_email: '',
      primary_phone: '',
      secondary_name: '',
      secondary_email: '',
      secondary_phone: '',
      company: '',
      vat_number: '',
      address: '',
    }
  });

  const handleSubmit = async (data: EventFormData) => {
    try {
      setIsSubmitting(true);
      
      const eventCode = generateEventCode(data.event_type || 'Event');
      
      // First, create the event
      const { error: eventError } = await supabase
        .from('events')
        .insert({
          event_code: eventCode,
          name: data.name,
          event_type: data.event_type,
          event_date: data.event_date || null,
          start_time: data.start_time || null,
          end_time: data.end_time || null,
          description: data.description || null,
          client_address: data.client_address || null,
          primary_name: data.primary_name || null,
          primary_email: data.primary_email || null,
          primary_phone: data.primary_phone || null,
          secondary_name: data.secondary_name || null,
          secondary_email: data.secondary_email || null,
          secondary_phone: data.secondary_phone || null,
          pax: data.pax || null,
          venues: data.venues && data.venues.length > 0 ? data.venues : null,
          company: data.company || null,
          vat_number: data.vat_number || null,
        });

      if (eventError) {
        throw new Error(`Error creating event: ${eventError.message}`);
      }
      
      toast({
        title: 'Success!',
        description: 'Event created successfully',
        variant: 'success',
      });
      
      // Navigate to event details page
      setTimeout(() => {
        navigate(`/events/${eventCode}`);
      }, 1000);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create event',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate a unique event code
  const generateEventCode = (type: string) => {
    const prefix = type ? type.substring(0, 3).toUpperCase() : 'EVT';
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${uuidv4().substring(0, 8)}-${randomDigits}`;
  };

  const handleCancel = () => {
    navigate('/events');
  };

  return (
    <div className="flex flex-col h-full">
      <Header 
        pageTitle="Create New Event" 
        showBackButton 
        backButtonPath="/events"
      />
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="max-w-5xl">
          <EditEventForm 
            form={form} 
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default NewEvent;
