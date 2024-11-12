import { UtensilsCrossed } from "lucide-react";
import { CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface MenuHeaderProps {
  isCustomMenu: boolean;
  onCustomMenuToggle: (checked: boolean) => void;
  eventName?: string;
}

const MenuHeader = ({ isCustomMenu, onCustomMenuToggle, eventName }: MenuHeaderProps) => {
  return (
    <CardHeader className="bg-gradient-to-r from-zinc-50 to-zinc-100 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <UtensilsCrossed className="h-6 w-6 text-zinc-700" />
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Menu Selection</h2>
            {eventName && <span className="text-zinc-500">- {eventName}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
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