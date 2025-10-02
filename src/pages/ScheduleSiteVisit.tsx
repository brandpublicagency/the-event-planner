
import { Header } from "@/components/layout/Header";
import { useEffect } from "react";

declare global {
  interface Window {
    Cal?: any;
  }
}

const ScheduleSiteVisit = () => {
  useEffect(() => {
    // Load Cal.com embed script
    const script = document.createElement("script");
    script.src = "https://app.cal.com/embed/embed.js";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      // Initialize Cal embed
      if (window.Cal) {
        window.Cal("init", "site-visit", { origin: "https://app.cal.com" });
        
        window.Cal.ns["site-visit"]("inline", {
          elementOrSelector: "#my-cal-inline-site-visit",
          config: { layout: "month_view" },
          calLink: "warmkaroo/site-visit",
        });

        window.Cal.ns["site-visit"]("ui", {
          cssVarsPerTheme: {
            light: { "cal-brand": "#b9bdcc" },
            dark: { "cal-brand": "#f7f7f7" }
          },
          hideEventTypeDetails: false,
          layout: "month_view"
        });
      }
    };

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="container-fluid h-screen flex flex-col">
      <Header 
        pageTitle="Schedule Site Visit" 
        contextTitle="Book a site visit with our team"
      />
      
      <div className="flex-1 p-4 min-h-0">
        <div className="w-full h-full rounded-lg overflow-auto border bg-background shadow-sm">
          <div 
            id="my-cal-inline-site-visit" 
            style={{ width: "100%", height: "100%", overflow: "scroll" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ScheduleSiteVisit;
