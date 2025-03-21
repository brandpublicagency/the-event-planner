
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface EventFormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

const EventFormActions = ({ isSubmitting, onCancel }: EventFormActionsProps) => {
  return (
    <div className="flex justify-end space-x-4 sticky bottom-0 bg-zinc-50/80 backdrop-blur-sm p-4 -mx-4">
      <Button 
        variant="outline" 
        onClick={onCancel}
        type="button"
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Create Event
      </Button>
    </div>
  );
};

export default EventFormActions;
