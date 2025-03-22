
import React from "react";
import { format, parseISO } from "date-fns";
import { Calendar, UserCircle, Building, Trash2, ArrowRight, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types/event";

interface EventCardProps {
  event: Event;
  handleDelete?: (eventCode: string) => Promise<void>;
  isDashboard?: boolean;
  // Add these props for backward compatibility
  onEdit?: (eventCode: string) => void;
  onView?: (eventCode: string) => void;
  onDelete?: (event: Event) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  handleDelete,
  isDashboard = false,
  onEdit,
  onView,
  onDelete
}) => {
  const { name, event_type, event_date, primary_name, company, event_code } = event;
  
  const formattedDate = event_date ? format(parseISO(event_date), 'EEE, MMM d, yyyy') : 'No date set';
  const isWedding = event_type?.toLowerCase().includes('wedding');
  const isCorporate = event_type?.toLowerCase().includes('corporate');
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(event_code);
  };
  
  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onView) onView(event_code);
  };
  
  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (handleDelete) {
      await handleDelete(event_code);
    } else if (onDelete) {
      onDelete(event);
    }
  };
  
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
        <div className="space-y-1 flex-1">
          <h4 className="font-medium text-zinc-900">{name}</h4>
          <div className="flex items-center text-sm text-zinc-500">
            <Calendar className="h-3.5 w-3.5 mr-1.5 text-zinc-400" />
            <span>{formattedDate}</span>
          </div>
          
          {primary_name && !isDashboard && (
            <div className="flex items-center text-sm text-zinc-500 mt-1">
              <UserCircle className="h-3.5 w-3.5 mr-1.5 text-zinc-400" />
              <span>{primary_name}</span>
            </div>
          )}
          
          {company && !isDashboard && (
            <div className="flex items-center text-sm text-zinc-500 mt-1">
              <Building className="h-3.5 w-3.5 mr-1.5 text-zinc-400" />
              <span>{company}</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2 justify-end">
          {!isDashboard && (
            <>
              {onEdit && (
                <Button
                  onClick={handleEditClick}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4 text-zinc-500" />
                  <span className="sr-only">Edit</span>
                </Button>
              )}
              
              {onView && (
                <Button
                  onClick={handleViewClick}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Eye className="h-4 w-4 text-zinc-500" />
                  <span className="sr-only">View</span>
                </Button>
              )}
              
              {(handleDelete || onDelete) && (
                <Button
                  onClick={handleDeleteClick}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4 text-zinc-500 hover:text-red-500" />
                  <span className="sr-only">Delete</span>
                </Button>
              )}
            </>
          )}
          
          {isDashboard && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 rounded-full p-0 w-8 text-zinc-500"
              onClick={handleViewClick}
            >
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">Go to event</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
