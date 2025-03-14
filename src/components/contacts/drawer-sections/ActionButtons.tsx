
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onClose: () => void;
  isSubmitting: boolean;
}

const ActionButtons = ({ onClose, isSubmitting }: ActionButtonsProps) => {
  return (
    <div className="flex justify-start space-x-2 py-4 border-t mt-auto sticky bottom-0 bg-background">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onClose}
        className="w-24"
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-32"
      >
        {isSubmitting ? "Saving..." : "Save changes"}
      </Button>
    </div>
  );
};

export default ActionButtons;
