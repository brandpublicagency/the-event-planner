import { CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface MenuHeaderProps {
  isCustomMenu: boolean;
  onCustomMenuToggle: (checked: boolean) => void;
  eventName?: string;
}

const MenuHeader = ({ isCustomMenu, onCustomMenuToggle, eventName }: MenuHeaderProps) => {
  return (
    <CardHeader className="border-b py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium">Menu Selection</h2>
          {eventName && (
            <>
              <span className="text-zinc-400">-</span>
              <span className="text-zinc-500">{eventName}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-600">Custom Menu</span>
          <Switch
            checked={isCustomMenu}
            onCheckedChange={onCustomMenuToggle}
            className="border border-zinc-200 data-[state=unchecked]:border-zinc-200"
          />
        </div>
      </div>
    </CardHeader>
  );
};

export default MenuHeader;