
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { EventTypeSelect } from '@/components/forms/EventTypeSelect';
import ClientDetails from '@/components/forms/ClientDetails';
import BrideDetails from '@/components/forms/BrideDetails';
import GroomDetails from '@/components/forms/GroomDetails';
import PackageSelection from '@/components/forms/PackageSelection';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventFormSchema } from '@/schemas/eventFormSchema';
import { EventDateSelect } from '@/components/forms/EventDateSelect';
import EventFormActions from '@/components/forms/EventFormActions';
import { VenueSelect } from '@/components/forms/VenueSelect';
import CompanyDetails from '@/components/forms/CompanyDetails';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { EventFormData } from '@/types/eventForm';
import EventBasicInfo from '@/components/forms/EventBasicInfo';

// Define EventFormValues type to match the schema and EventFormData
interface EventFormValues {
  name: string;
  event_type: EventFormData['event_type'];
  event_date?: string;
  start_time: string;
  end_time: string;
  client_address: string;
  venues: string[];
  pax?: number;
  package: string;
  description: string;
  company: string;
  vat_number: string;
  
  // Wedding-specific fields
  bride_name?: string;
  bride_email?: string;
  bride_mobile?: string;
  groom_name?: string;
  groom_email?: string;
  groom_mobile?: string;
  
  // Corporate-specific fields
  company_name?: string;
  contact_person?: string;
  contact_email?: string;
  contact_mobile?: string;
  company_vat?: string;
  company_address?: string;
}

const NewEvent = () => {
  const [eventType, setEventType] = useState('Wedding');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmissionComplete, setIsSubmissionComplete] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const methods = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: '',
      event_type: 'Wedding',
      event_date: undefined,
      start_time: '',
      end_time: '',
      client_address: '',
      venues: [],
      package: '',
      description: '',
      company: '',
      vat_number: '',
      // Wedding-specific fields
      bride_name: '',
      bride_email: '',
      bride_mobile: '',
      groom_name: '',
      groom_email: '',
      groom_mobile: '',
      // Corporate-specific fields
      company_name: '',
      contact_person: '',
      contact_email: '',
      contact_mobile: '',
      company_vat: '',
      company_address: '',
    }
  });

  const watchEventType = methods.watch('event_type');

  useEffect(() => {
    if (watchEventType) {
      setEventType(watchEventType);
    }
  }, [watchEventType]);

  const handleSubmit = async (data: EventFormValues) => {
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
          primary_name: data.bride_name || data.contact_person || null,
          primary_email: data.bride_email || data.contact_email || null,
          primary_phone: data.bride_mobile || data.contact_mobile || null,
          secondary_name: data.groom_name || null,
          secondary_email: data.groom_email || null,
          secondary_phone: data.groom_mobile || null,
          pax: data.pax || null,
          package_id: data.package || null,
          venues: data.venues && data.venues.length > 0 ? data.venues : null,
          company: data.company || data.company_name || null,
          vat_number: data.vat_number || data.company_vat || null,
        });

      if (eventError) {
        throw new Error(`Error creating event: ${eventError.message}`);
      }

      // Using mock notification for event creation instead of trying to access the event_notifications table
      console.log(`Created event ${eventCode} - would trigger notification in a real system`);
      
      setIsSubmissionComplete(true);
      
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
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-1 container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
        
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column */}
              <div className="space-y-8">
                <EventTypeSelect form={methods} />
                <EventBasicInfo form={methods} />
                <EventDateSelect form={methods} />
                <PackageSelection form={methods} />
                <VenueSelect form={methods} />
              </div>
              
              {/* Right column */}
              <div className="space-y-8">
                {eventType === 'Corporate' ? (
                  <CompanyDetails form={methods} />
                ) : eventType === 'Wedding' ? (
                  <>
                    <ClientDetails form={methods} />
                    <BrideDetails form={methods} />
                    <GroomDetails form={methods} />
                  </>
                ) : (
                  <ClientDetails form={methods} />
                )}
              </div>
            </div>
            
            <EventFormActions 
              isSubmitting={isSubmitting} 
              onCancel={handleCancel}
            />
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default NewEvent;
