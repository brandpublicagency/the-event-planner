import { Switch } from "@/components/ui/switch";

interface MenuHeaderProps {
  isCustomMenu: boolean;
  onCustomMenuToggle: (checked: boolean) => void;
  eventName?: string;
}

const MenuHeader = ({ isCustomMenu, onCustomMenuToggle }: MenuHeaderProps) => {
  return (
    <div className="flex items-center justify-end">
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-600">Custom Menu</span>
        <Switch
          checked={isCustomMenu}
          onCheckedChange={onCustomMenuToggle}
          className="border border-zinc-200 data-[state=unchecked]:border-zinc-200"
        />
      </div>
    </div>
  );
};

export default MenuHeader;