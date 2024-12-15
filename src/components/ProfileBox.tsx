import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import FlipCard from "@/components/FlipCard";
import ProfileFrontContent from "@/components/profile/ProfileFrontContent";
import ProfileBackContent from "@/components/profile/ProfileBackContent";

const ProfileBox = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error("Session error:", sessionError);
        navigate('/login');
        return null;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Profile error:", profileError);
        throw profileError;
      }

      return profileData;
    },
    retry: false,
    meta: {
      errorHandler: (error: Error) => {
        console.error("Profile query error:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      }
    }
  });

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-[450px] w-full">
      <FlipCard 
        front={<ProfileFrontContent profile={profile} />} 
        back={<ProfileBackContent onLogout={handleLogout} />} 
      />
    </div>
  );
};

export default ProfileBox;