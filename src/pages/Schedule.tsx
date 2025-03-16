
import { Header } from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users } from "lucide-react";

const Schedule = () => {
  return (
    <div className="container-fluid h-full flex flex-col">
      <Header 
        pageTitle="Schedule" 
        contextTitle="Book a site visit or meeting with our team"
      />
      
      <div className="flex-1 p-4">
        <Tabs defaultValue="meeting" className="w-full h-full flex flex-col">
          <div className="mb-4">
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
              <TabsTrigger value="meeting" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Management Meeting</span>
              </TabsTrigger>
              <TabsTrigger value="site-visit" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Site Visit</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="meeting" className="flex-1 mt-0 rounded-lg overflow-hidden border bg-white shadow-sm">
            <iframe
              src="https://cal.com/warmkaroo/management-booking?embed=true"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ width: "100%", height: "100%", border: "none" }}
              allowFullScreen
            ></iframe>
          </TabsContent>
          
          <TabsContent value="site-visit" className="flex-1 mt-0 rounded-lg overflow-hidden border bg-white shadow-sm">
            <iframe
              src="https://cal.com/warmkaroo/site-visit?embed=true"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ width: "100%", height: "100%", border: "none" }}
              allowFullScreen
            ></iframe>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Schedule;
