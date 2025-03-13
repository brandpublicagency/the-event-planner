
import React from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { NotificationDropdown } from "./NotificationDropdown";

export const NotificationButton = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        {/* Empty div that takes up space but doesn't show anything */}
        <div className="w-10 h-10" onClick={(e) => e.preventDefault()} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0" sideOffset={4}>
        <NotificationDropdown />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
