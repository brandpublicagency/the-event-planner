
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface EventFormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

const EventFormActions = ({ isSubmitting, onCancel }: EventFormActionsProps) => {
  return (
    <div className="flex justify-end space-x-3 sticky bottom-0 bg-muted/80 backdrop-blur-sm p-3 -mx-4">
      <Button 
        variant="outline" 
        onClick={onCancel}
        type="button"
        disabled={isSubmitting}
        size="sm"
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting} size="sm">
        {isSubmitting && (
          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
        )}
        Create Event
      </Button>
    </div>
  );
};

export default EventFormActions;
