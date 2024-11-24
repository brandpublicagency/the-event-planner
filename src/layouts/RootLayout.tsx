import { ScrollArea } from "@/components/ui/scroll-area";
import Sidebar from "@/components/Sidebar";
import { useState, ReactNode } from "react";

export const RootLayout = ({ children }: { children: ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-zinc-50">
      <div
        className={`transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-[80px]" : "w-64"
        } bg-white shadow-sm`}
      >
        <ScrollArea className="h-full">
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </ScrollArea>
      </div>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};