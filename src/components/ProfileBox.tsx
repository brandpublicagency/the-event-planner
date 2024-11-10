import { LogOut, Mail, Phone, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import FlipCard from "@/components/FlipCard";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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

  const handleEditField = (field: string) => {
    toast({
      title: `Editing ${field}`,
      description: "This feature will be implemented soon",
    });
  };

  return (
    <FlipCard
      front={
        <div className="relative h-full w-full">
          <img
            src="https://www.brandpublic.agency/wp-content/uploads/2024/11/wk.jpg"
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
        <div className="h-full flex flex-col justify-center px-5 py-6 bg-gradient-to-br from-white via-zinc-50/50 to-white">
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-zinc-900">Profile Information</h3>
              <p className="text-sm text-zinc-500 mb-3">Your personal details and contact information</p>
            </div>
            <Separator className="w-full" />
            <div className="grid gap-2.5 w-full">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-zinc-100 shadow-sm group w-full">
                <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-zinc-500">Email</p>
                  <p className="text-sm text-zinc-900">louisa@example.com</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleEditField('email')}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-zinc-100 shadow-sm group w-full">
                <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-zinc-500">Mobile</p>
                  <p className="text-sm text-zinc-900">(555) 123-4567</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleEditField('mobile')}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <Separator className="my-4 w-full" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors w-full justify-center"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      }
    />
  );
};

export default ProfileBox;
