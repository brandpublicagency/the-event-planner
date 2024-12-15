import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import EventsTable from "@/components/EventsTable";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Events() {
  const navigate = useNavigate();

  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('created_by', user.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Events</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={() => navigate('/events/new')}>
              <Plus className="mr-2 h-4 w-4" /> Add Event
            </Button>
          </div>
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <EventsTable events={events || []} />
        )}
      </div>
    </div>
  );
}