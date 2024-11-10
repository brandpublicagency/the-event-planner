import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfileBox = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
      toast({
        title: "Logged out successfully",
      });
    } catch (error) {
      toast({
        title: "Error logging out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="px-3 py-2">
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full">
          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-100 transition-colors duration-200">
            <Avatar>
              <AvatarImage src="https://pink-book.co.za/wp-content/uploads/2024/02/Warm-Karoo-Wedding-Event-Venue-39.png" />
              <AvatarFallback>LM</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">Louisa Marin</p>
              <p className="text-xs text-zinc-500">louisa@example.com</p>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfileBox;