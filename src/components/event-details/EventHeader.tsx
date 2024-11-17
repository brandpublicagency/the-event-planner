import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventHeaderProps {
  eventCode: string;
  onPrint: () => void;
}

export const EventHeader = ({ eventCode, onPrint }: EventHeaderProps) => {
  const navigate = useNavigate();

  const handleEditBasicDetails = () => {
    if (eventCode) {
      navigate(`/events/${eventCode}/edit`);
    }
  };

  return (
    <div className="flex items-center justify-between mb-6 print:hidden">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => navigate('/events')}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </Button>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleEditBasicDetails}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit Details
        </Button>
        <Button onClick={onPrint} variant="outline" size="sm">
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>
    </div>
  );
};