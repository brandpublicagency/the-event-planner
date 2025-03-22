
import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit, Save } from "lucide-react";
import { WeddingMenuPlanner } from "@/components/WeddingMenuPlanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Event } from "@/types/event";
import { EventHeader } from "@/components/event-details/EventHeader";
import { EventInfo } from "@/components/event-details/EventInfo";
import { Header } from "@/components/layout/Header";
import { updateEvent } from "@/services/eventService";
import { useToast } from "@/hooks/use-toast";

const EventDetails = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isCustomMenu, setIsCustomMenu] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  
  const handleBackNavigation = () => {
    if (location.state?.previousPath === 'menu-selection') {
      navigate('/menu-selection');
    } else {
      navigate('/events');
    }
  };
  
  const {
    data: event,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      try {
        const {
          data,
          error
        } = await supabase.from('events').select('*').eq('event_code', id).maybeSingle();
        clearTimeout(timeoutId);
        if (error) throw error;
        if (!data) throw new Error('Event not found');
        return data as Event;
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        throw err;
      }
    },
    retry: 1,
    retryDelay: 1000
  });
  
  const [menuState, setMenuState] = React.useState<any>(null);
  const [saveMenuSelections, setSaveMenuSelections] = React.useState<(() => Promise<void>) | null>(null);
  
  const handleEditEvent = () => {
    if (id) {
      navigate(`/events/${id}/edit`);
    }
  };

  const handleSaveMenu = async () => {
    if (!id || !menuState || !saveMenuSelections) return;
    
    setIsSaving(true);
    try {
      // Call the saveMenuSelections function from WeddingMenuPlanner
      await saveMenuSelections();
      
      toast({
        title: "Success",
        description: "Menu saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save menu",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return <div className="flex flex-col h-full">
        <Header showBackButton onBackButtonClick={handleBackNavigation} />
        <div className="flex-1 space-y-6 p-6 md:p-8">
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </div>;
  }
  
  if (error) {
    return <div className="flex flex-col h-full">
        <Header showBackButton onBackButtonClick={handleBackNavigation} />
        <div className="flex-1 p-8">
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-red-700 mb-2">Error Loading Event</h2>
              <p className="text-red-600 mb-4">{error instanceof Error ? error.message : 'Failed to load event details'}</p>
              <Button onClick={() => navigate('/events')} variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Events
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>;
  }
  
  if (!event) {
    return <div className="flex flex-col h-full">
        <Header showBackButton onBackButtonClick={handleBackNavigation} />
        <div className="flex-1 p-8">
          <Card className="border-yellow-200 bg-yellow-50/50">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-yellow-700 mb-2">Event Not Found</h2>
              <p className="text-yellow-600 mb-4">The event you're looking for doesn't exist or has been deleted.</p>
              <Button onClick={() => navigate('/events')} variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Events
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>;
  }
  
  const formattedDate = event?.event_date ? format(new Date(event.event_date), 'dd MMMM yyyy') : 'No date';
  
  return <div className="flex flex-col h-full">
      <Header 
        showBackButton 
        onBackButtonClick={handleBackNavigation}
        actionButton={{
          label: "Edit Event",
          icon: <Edit className="h-4 w-4 mr-1" />,
          onClick: handleEditEvent,
          variant: "outline"
        }}
      />
      
      <div className="flex-1 p-6 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="print:hidden mb-6">
            {event && <EventHeader 
              eventCode={event.event_code} 
              event={event}
              menuState={menuState}
              isCustomMenu={isCustomMenu} 
              onCustomMenuToggle={setIsCustomMenu} 
            />}
          </div>
          
          <div className="print-container py-[20px] px-[25px] rounded-md bg-white">
            {event && <EventInfo event={event} formattedDate={formattedDate} formattedTime="" />}
            
            {id && <WeddingMenuPlanner 
              eventCode={id} 
              eventName={event?.name} 
              isCustomMenu={isCustomMenu} 
              onCustomMenuToggle={setIsCustomMenu}
              onMenuStateChange={setMenuState}
              onSaveMenuCallback={setSaveMenuSelections}
            />}
            
            <div className="flex justify-end mt-6 print:hidden">
              <Button 
                onClick={handleSaveMenu}
                disabled={isSaving || !menuState}
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1"></div>
                ) : (
                  <Save className="h-4 w-4 mr-1" />
                )}
                Save Menu
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};

export default EventDetails;
