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
    <div 
      className="relative h-full perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        <div className="absolute w-full h-full backface-hidden">
          <Card className="w-full h-full cursor-pointer rounded-xl overflow-hidden card-with-glow">
            {front}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 z-10"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </Card>
        </div>
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <Card className="w-full h-full cursor-pointer rounded-xl overflow-hidden card-with-glow">
            <div className="p-6 relative z-10">
              {back}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;