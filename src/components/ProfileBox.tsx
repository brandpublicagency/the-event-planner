import { LogOut, Mail, Phone, MapPin, Building2 } from "lucide-react";
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
        <div className="h-full flex flex-col p-6 bg-gradient-to-br from-white via-zinc-50/50 to-white">
          <div className="space-y-6 flex-1">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-zinc-900">Profile Information</h3>
              <p className="text-sm text-zinc-500">Your personal details and contact information</p>
            </div>
            <Separator />
            <div className="grid gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-zinc-100 shadow-sm">
                <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-500">Email</p>
                  <p className="text-sm text-zinc-900">louisa@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-zinc-100 shadow-sm">
                <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-500">Phone</p>
                  <p className="text-sm text-zinc-900">(555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-zinc-100 shadow-sm">
                <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-500">Company</p>
                  <p className="text-sm text-zinc-900">Pink Book Events</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-zinc-100 shadow-sm">
                <div className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-500">Location</p>
                  <p className="text-sm text-zinc-900">San Francisco, CA</p>
                </div>
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