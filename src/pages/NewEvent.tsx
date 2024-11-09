import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import FormSection from "@/components/forms/FormSection";
import EventBasicInfo from "@/components/forms/EventBasicInfo";
import ClientDetails from "@/components/forms/ClientDetails";
import { ArrowLeft } from "lucide-react";

const NewEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm();

  const { data: venues } = useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const { error } = await supabase
        .from('events')
        .insert([{
          ...data,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event created successfully",
      });

      navigate('/events');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate("/events")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Button>

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">New Event</h2>
      </div>

      <div className="mx-auto max-w-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 rounded-lg border bg-card p-8 shadow-sm">
              <FormSection 
                title="Event Details" 
                description="Enter the basic information about the event."
              >
                <EventBasicInfo form={form} venues={venues} />
              </FormSection>

              <FormSection 
                title="Client Details" 
                description="Enter the contact information for the client."
              >
                <ClientDetails form={form} />
              </FormSection>

              <div className="flex justify-end space-x-4 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/events')}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit">Create Event</Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewEvent;