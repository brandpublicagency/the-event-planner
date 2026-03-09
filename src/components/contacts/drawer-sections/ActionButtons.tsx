
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onClose: () => void;
  isSubmitting: boolean;
}

const ActionButtons = ({
  onClose,
  isSubmitting
}: ActionButtonsProps) => {
  return (
    <div className="py-[10px] pb-4 pt-6">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onClose} 
        className="w-20 ml-0"
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting} 
        className="w-28 ml-[10px]"
      >
        {isSubmitting ? "Saving..." : "Save changes"}
      </Button>
    </div>
  );
};

export default ActionButtons;
