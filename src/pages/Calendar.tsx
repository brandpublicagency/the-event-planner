import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Calendar = () => {
  useEffect(() => {
    // Initialize Cal.com embed
    (async function () {
      const Cal = (await import("@calcom/embed-react")).default;
      Cal("init");
    })();
  }, []);

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
          <div 
            data-cal-link={profile?.cal_username || "team/default"} 
            style={{ minHeight: "800px" }} 
          />
        </Card>
      </div>
    </div>
  );
};

export default Calendar;