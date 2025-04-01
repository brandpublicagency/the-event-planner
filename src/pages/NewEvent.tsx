
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventFormSchema } from '@/schemas/eventFormSchema';
import { toast } from '@/hooks/use-toast';
import { EventFormData } from '@/types/eventForm';
import EditEventForm from '@/components/forms/EditEventForm';
import { createNewEvent } from '@/utils/createEventUtils';
import { useQueryClient } from '@tanstack/react-query';

const NewEvent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema) as any,
    defaultValues: {
      name: '',
      event_type: 'Wedding',
      event_date: undefined,
      start_time: '',
      end_time: '',
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
    },
    mode: 'onBlur', // Validate on blur to improve user experience
  });

  // Watch the event type to handle conditional validation
  const eventType = form.watch('event_type');

  // Set secondary email to empty string when event type changes from Wedding to another type
  React.useEffect(() => {
    if (eventType !== 'Wedding') {
      // For non-wedding events, ensure secondary fields can be empty
      const currentSecondaryEmail = form.getValues('secondary_email');
      if (!currentSecondaryEmail) {
        form.setValue('secondary_email', '');
      }
    }
  }, [eventType, form]);

  const handleSubmit = async (data: EventFormData) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting form data:", JSON.stringify(data, null, 2));
      
      // Make sure venues is always an array
      if (!Array.isArray(data.venues)) {
        data.venues = [];
      }
      
      // For non-wedding events, an empty string in secondary_email should be treated as null
      if (data.event_type !== 'Wedding' && data.secondary_email === '') {
        data.secondary_email = null;
      }
      
      const eventCode = await createNewEvent(data);
      
      // Invalidate all events queries to ensure updated data is fetched
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming_events"] });
      
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
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default NewEvent;
