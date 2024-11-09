import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Cal, { getCalApi } from "@calcom/embed-react";
import { useToast } from "@/components/ui/use-toast";

const Calendar = () => {
  const { toast } = useToast();

  useEffect(() => {
    (async function () {
      try {
        const cal = await getCalApi();
        // Initialize with configuration
        cal("init", {
          origin: "https://app.cal.com",
        });
      } catch (error) {
        console.error("Failed to initialize Cal:", error);
        toast({
          title: "Calendar Error",
          description: "Failed to load the calendar. Please try refreshing the page.",
          variant: "destructive",
        });
      }
    })();
  }, [toast]);

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
      </div>
      
      <div className="grid gap-8">
        <Card className="p-6">
          <Cal
            calLink="info@warmkaroo.com"
            style={{ width: "100%", height: "800px", overflow: "hidden" }}
            config={{
              name: profile?.full_name || "",
              email: "",
              theme: "light",
              hideEventTypeDetails: false,
            }}
          />
        </Card>
      </div>
    </div>
  );
};

export default Calendar;