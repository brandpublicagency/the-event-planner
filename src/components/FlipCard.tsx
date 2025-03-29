
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  onEdit?: () => void;
  className?: string; // Added className prop
}

const FlipCard = ({ front, back, onEdit, className }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the flip action when clicking edit
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <div className="relative h-full w-full [perspective:1000px]">
      <div
        className={`relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        <div className="absolute h-full w-full [backface-visibility:hidden]">
          <Card 
            className={`h-full w-full cursor-pointer overflow-hidden rounded-xl ${className || ''}`}
            onClick={handleCardClick}
          >
            {front}
            {onEdit && (
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-4 z-10"
                onClick={handleEditClick}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </Card>
        </div>
        <div className="absolute h-full w-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <Card 
            className={`h-full w-full cursor-pointer overflow-hidden rounded-xl ${className || ''}`}
            onClick={handleCardClick}
          >
            <div className="p-6">{back}</div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
