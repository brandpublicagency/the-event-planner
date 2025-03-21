
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import EventBasicInfo from '@/components/forms/EventBasicInfo';
import EventTypeSelect from '@/components/forms/EventTypeSelect';
import ClientDetails from '@/components/forms/ClientDetails';
import BrideDetails from '@/components/forms/BrideDetails';
import GroomDetails from '@/components/forms/GroomDetails';
import PackageSelection from '@/components/forms/PackageSelection';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventFormSchema } from '@/schemas/eventFormSchema';
import EventDateSelect from '@/components/forms/EventDateSelect';
import EventFormActions from '@/components/forms/EventFormActions';
import VenueSelect from '@/components/forms/VenueSelect';
import CompanyDetails from '@/components/forms/CompanyDetails';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

// Define EventFormValues type since it's missing from the schema
interface EventFormValues {
  name: string;
  eventType: string;
  eventDate?: Date;
  startTime: string;
  endTime: string;
  clientAddress: string;
  primaryName: string;
  primaryEmail: string;
  primaryPhone: string;
  secondaryName: string;
  secondaryEmail: string;
  secondaryPhone: string;
  pax?: number;
  package: string;
  description: string;
  venues: string[];
  company: string;
  vatNumber: string;
  companyDetails?: {
    companyName: string;
    companyVat: string;
    companyAddress: string;
    contactPerson: string;
    contactEmail: string;
    contactMobile: string;
  }
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
      eventType: 'Wedding',
      eventDate: undefined,
      startTime: '',
      endTime: '',
      clientAddress: '',
      primaryName: '',
      primaryEmail: '',
      primaryPhone: '',
      secondaryName: '',
      secondaryEmail: '',
      secondaryPhone: '',
      pax: undefined,
      package: '',
      description: '',
      venues: [],
      company: '',
      vatNumber: '',
      companyDetails: {
        companyName: '',
        companyVat: '',
        companyAddress: '',
        contactPerson: '',
        contactEmail: '',
        contactMobile: '',
      }
    }
  });

  const watchEventType = methods.watch('eventType');

  useEffect(() => {
    if (watchEventType) {
      setEventType(watchEventType);
    }
  }, [watchEventType]);

  const handleSubmit = async (data: EventFormValues) => {
    try {
      setIsSubmitting(true);
      
      const eventCode = generateEventCode(data.eventType || 'Event');
      
      // First, create the event
      const { error: eventError } = await supabase
        .from('events')
        .insert({
          event_code: eventCode,
          name: data.name,
          event_type: data.eventType,
          event_date: data.eventDate ? format(data.eventDate, 'yyyy-MM-dd') : null,
          start_time: data.startTime || null,
          end_time: data.endTime || null,
          description: data.description || null,
          client_address: data.clientAddress || null,
          primary_name: data.primaryName || null,
          primary_email: data.primaryEmail || null,
          primary_phone: data.primaryPhone || null,
          secondary_name: data.secondaryName || null,
          secondary_email: data.secondaryEmail || null,
          secondary_phone: data.secondaryPhone || null,
          pax: data.pax || null,
          package_id: data.package || null,
          venues: data.venues && data.venues.length > 0 ? data.venues : null,
          company: data.company || null,
          vat_number: data.vatNumber || null,
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
