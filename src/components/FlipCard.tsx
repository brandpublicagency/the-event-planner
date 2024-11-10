import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  onEdit?: () => void;
}

const FlipCard = ({ front, back, onEdit }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative h-full w-full [perspective:1000px]">
      <div
        className={`relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        <div className="absolute h-full w-full [backface-visibility:hidden]">
          <Card 
            className="h-full w-full cursor-pointer overflow-hidden rounded-xl"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {front}
            {onEdit && (
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-4 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </Card>
        </div>
        <div className="absolute h-full w-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <Card 
            className="h-full w-full cursor-pointer overflow-hidden rounded-xl"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="p-6">{back}</div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;