import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import FlipCard from "@/components/FlipCard";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const ProfileBox = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  const frontContent = (
    <div className="h-full">
      <div className="relative h-full">
        <img
          src="https://www.brandpublic.agency/wp-content/uploads/2024/11/cee34d9e-f5bc-42ee-8530-9e4e55a1a702.jpeg"
          alt="Profile Cover"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h2 className="text-2xl font-semibold text-white">
            {profile?.full_name || 'Welcome'}
          </h2>
          {profile?.surname && (
            <p className="mt-1 text-sm text-white/80">{profile.surname}</p>
          )}
        </div>
      </div>
    </div>
  );

  const backContent = (
    <div className="h-full">
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

  return (
    <div className="h-[450px] w-full">
      <FlipCard front={frontContent} back={backContent} />
    </div>
  );
};

export default ProfileBox;