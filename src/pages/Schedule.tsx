
import { Header } from "@/components/layout/Header";

const Schedule = () => {
  return (
    <div className="container-fluid h-full flex flex-col">
      <Header 
        pageTitle="Schedule a Meeting" 
        contextTitle="Book a site visit or meeting with our team"
      />
      
      <div className="flex-1">
        <div className="w-full h-full">
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

export default Schedule;
