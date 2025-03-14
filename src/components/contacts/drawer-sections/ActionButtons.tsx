import { Button } from "@/components/ui/button";
interface ActionButtonsProps {
  onClose: () => void;
  isSubmitting: boolean;
}
const ActionButtons = ({
  onClose,
  isSubmitting
}: ActionButtonsProps) => {
  return <div className="py-[10px]">
      <Button type="button" variant="outline" onClick={onClose} className="w-24 mx-[10px]">
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting} className="w-32">
        {isSubmitting ? "Saving..." : "Save changes"}
      </Button>
    </div>;
};
export default ActionButtons;