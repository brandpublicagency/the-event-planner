import { Header } from "@/components/layout/Header";

const ScheduleSiteVisit = () => {
  return (
    <div className="container-fluid h-screen flex flex-col">
      <Header 
        pageTitle="Schedule Site Visit" 
        contextTitle="Book a site visit with our team"
      />
      
      <div className="flex-1 p-4 min-h-0">
        <div className="w-full h-full rounded-lg overflow-hidden border bg-background shadow-sm">
          <iframe
            src="https://cal.com/warmkaroo/site-visit"
            className="w-full h-full"
            style={{ minHeight: "700px", border: "none" }}
            frameBorder="0"
            title="Schedule Site Visit"
          />
        </div>
      </div>
    </div>
  );
};

export default ScheduleSiteVisit;
