import { useState } from "react";
import { Card } from "@/components/ui/card";

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
}

const FlipCard = ({ front, back }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative h-full perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        <div className="absolute w-full h-full backface-hidden">
          <Card className="w-full h-full p-6 cursor-pointer bg-white hover:bg-zinc-50/50 transition-colors">
            {front}
          </Card>
        </div>
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <Card className="w-full h-full p-6 cursor-pointer bg-white hover:bg-zinc-50/50 transition-colors">
            {back}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;