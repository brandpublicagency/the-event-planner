
import { Header } from "@/components/layout/Header";

const ScheduleMeeting = () => {
  return (
    <div className="container-fluid h-screen flex flex-col">
      <Header 
        pageTitle="Schedule Meeting" 
        contextTitle="Book a management meeting with our team"
      />
      
      <div className="flex-1 p-4 min-h-0">
        <div className="w-full h-full rounded-lg overflow-hidden border bg-background shadow-sm">
          <iframe
            src="https://cal.com/warmkaroo/management-booking"
            width="100%"
            height="100%"
            frameBorder={0}
            style={{ 
              width: "100%", 
              height: "100%", 
              border: "none",
              minHeight: "600px"
            }}
            allow="camera; microphone; autoplay; encrypted-media; payment"
            loading="lazy"
            title="Schedule Management Meeting"
          />
        </div>
      </div>
    </div>
  );
};

export default ScheduleMeeting;
