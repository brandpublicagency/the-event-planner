import { LogOut, Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import FlipCard from "@/components/FlipCard";
import { Separator } from "@/components/ui/separator";

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
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-lg" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="text-white">
              <div className="text-2xl font-semibold">Louisa Marin</div>
              <div className="text-sm opacity-80">louisa@example.com</div>
            </div>
          </div>
        </div>
      }
      back={
        <div className="h-full flex flex-col p-6">
          <div className="space-y-4 flex-1">
            <h3 className="font-semibold text-lg">Profile Information</h3>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Mail className="h-4 w-4" />
                <span>louisa@example.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Phone className="h-4 w-4" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      }
      onEdit={handleEditProfile}
    />
  );
};

export default ProfileBox;