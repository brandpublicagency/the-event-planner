
import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export const NotificationButton = () => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
    >
      <Bell className="h-5 w-5 text-zinc-700" />
      <span className="sr-only">Notifications</span>
    </Button>
  );
};
