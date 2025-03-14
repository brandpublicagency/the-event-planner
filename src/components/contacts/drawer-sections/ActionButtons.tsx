
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
    <div className="py-[10px] pb-5 pt-8">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onClose} 
        className="w-24 rounded-[4px] ml-0"
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting} 
        className="w-32 rounded-[4px] ml-[10px]"
      >
        {isSubmitting ? "Saving..." : "Save changes"}
      </Button>
    </div>
  );
};

export default ActionButtons;
