
import { Header } from "@/components/layout/Header";

const ScheduleMeeting = () => {
  return (
    <div className="container-fluid h-full flex flex-col">
      <Header 
        pageTitle="Schedule Meeting" 
        contextTitle="Book a management meeting with our team"
      />
      
      <div className="flex-1 p-4">
        <div className="w-full h-full flex-1 rounded-lg overflow-hidden border bg-white shadow-sm">
          <iframe
            src="https://cal.com/warmkaroo/management-booking?embed=true"
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ width: "100%", height: "100%", border: "none" }}
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMeeting;
