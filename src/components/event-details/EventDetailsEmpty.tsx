
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";

interface EventDetailsEmptyProps {
  onBackButtonClick: () => void;
}

export const EventDetailsEmpty: React.FC<EventDetailsEmptyProps> = ({
  onBackButtonClick
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col h-full">
      <Header showBackButton onBackButtonClick={onBackButtonClick} />
      <div className="flex-1 p-8">
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-yellow-700 mb-2">Event Not Found</h2>
            <p className="text-yellow-600 mb-4">The event you're looking for doesn't exist or has been deleted.</p>
            <Button onClick={() => navigate('/events')} variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
