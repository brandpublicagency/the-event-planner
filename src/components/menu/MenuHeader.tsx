import { UtensilsCrossed } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";

const MenuHeader = () => {
  return (
    <CardHeader className="bg-gradient-to-r from-zinc-50 to-zinc-100 border-b">
      <div className="flex items-center justify-center space-x-2">
        <UtensilsCrossed className="h-6 w-6 text-zinc-700" />
        <CardTitle className="text-2xl font-bold text-center">Menu Selection</CardTitle>
      </div>
    </CardHeader>
  );
};

export default MenuHeader;