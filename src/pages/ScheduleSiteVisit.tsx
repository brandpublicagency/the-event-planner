
import { Header } from "@/components/layout/Header";

const ScheduleSiteVisit = () => {
  return (
    <div className="container-fluid h-full flex flex-col">
      <Header 
        pageTitle="Schedule Site Visit" 
        contextTitle="Book a site visit with our team"
      />
      
      <div className="flex-1 p-4">
        <div className="w-full h-full flex-1 rounded-lg overflow-hidden border bg-white shadow-sm">
          <iframe
            src="https://cal.com/warmkaroo/site-visit?embed=true"
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

export default ScheduleSiteVisit;
