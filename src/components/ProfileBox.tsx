import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const ProfileBox = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      return profileData;
    },
  });

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="relative h-[450px] w-full">
      <img
        src="https://www.brandpublic.agency/wp-content/uploads/2024/11/cee34d9e-f5bc-42ee-8530-9e4e55a1a702.jpeg"
        alt="Profile Cover"
        className="h-full w-full object-cover rounded-lg"
      />
      <Button 
        variant="ghost" 
        size="sm"
        onClick={handleLogout}
        className="absolute top-4 right-4 text-red-500 hover:text-red-600 hover:bg-white/10 bg-white/20"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign out
      </Button>
    </div>
  );
};

export default ProfileBox;