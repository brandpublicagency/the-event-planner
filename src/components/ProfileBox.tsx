import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import FlipCard from "@/components/FlipCard";

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

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
  };

  return (
    <FlipCard
      front={
        <div className="relative h-full w-full">
          <img
            src="https://pink-book.co.za/wp-content/uploads/2024/02/Warm-Karoo-Wedding-Event-Venue-39.png"
            alt="Profile"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <div className="text-white">
              <div className="text-2xl font-semibold">Louisa Marin</div>
              <div className="text-sm opacity-80">louisa@example.com</div>
            </div>
          </div>
        </div>
      }
      back={
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm">Email: louisa@example.com</p>
            <p className="text-sm">Phone: (555) 123-4567</p>
            <p className="text-sm">Location: San Francisco, CA</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4 inline-block" />
            Logout
          </button>
        </div>
      }
      onEdit={handleEditProfile}
    />
  );
};

export default ProfileBox;