import { UtensilsCrossed } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface MenuHeaderProps {
  isCustomMenu: boolean;
  onCustomMenuToggle: (checked: boolean) => void;
}

const MenuHeader = ({ isCustomMenu, onCustomMenuToggle }: MenuHeaderProps) => {
  return (
    <CardHeader className="bg-gradient-to-r from-zinc-50 to-zinc-100 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <UtensilsCrossed className="h-6 w-6 text-zinc-700" />
          <CardTitle className="text-2xl font-bold">Menu Selection</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-zinc-600">Custom Menu</span>
          <Switch
            checked={isCustomMenu}
            onCheckedChange={onCustomMenuToggle}
          />
        </div>
      </div>
    </CardHeader>
  );
};

export default MenuHeader;