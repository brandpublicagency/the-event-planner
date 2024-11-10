import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="flex h-16 items-center justify-between bg-white px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search..."
            className="h-9 w-64 pl-9 text-sm bg-zinc-50 border-0"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-zinc-900">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-zinc-900">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};

export default Header;