import { UtensilsCrossed, Download } from "lucide-react";
import { CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface MenuHeaderProps {
  isCustomMenu: boolean;
  onCustomMenuToggle: (checked: boolean) => void;
  eventName?: string;
  onDownloadPDF?: () => void;
}

const MenuHeader = ({ isCustomMenu, onCustomMenuToggle, eventName, onDownloadPDF }: MenuHeaderProps) => {
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
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-600">Custom Menu</span>
            <Switch
              checked={isCustomMenu}
              onCheckedChange={onCustomMenuToggle}
            />
          </div>
          {onDownloadPDF && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownloadPDF}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          )}
        </div>
      </div>
    </CardHeader>
  );
};

export default MenuHeader;