import React from "react";
import { PageHeader } from "@/components/PageHeader";

const MyBusiness = () => {
  return (
    <div className="flex flex-col h-full">
      <PageHeader 
        pageTitle="My Business"
        actionButton={{
          label: "Create Report",
          onClick: () => console.log("Create report clicked")
        }}
      />
      
      <div className="container mx-auto py-6 max-w-7xl">
        {/* Content removed as requested */}
      </div>
    </div>
  );
};

export default MyBusiness;
