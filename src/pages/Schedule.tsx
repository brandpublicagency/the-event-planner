
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";

const Schedule = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Schedule a Meeting" 
        description="Book a site visit or meeting with our team"
      />
      
      <Card className="mt-6 overflow-hidden bg-white shadow-sm">
        <div className="p-0 h-[800px]">
          <iframe
            src="https://cal.com/warmkaroo/site-visit?date=2025-03-17&embed=true"
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ width: "100%", height: "100%", border: "none" }}
            allowFullScreen
          ></iframe>
        </div>
      </Card>
    </div>
  );
};

export default Schedule;
