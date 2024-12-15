import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import FlipCard from "@/components/FlipCard";
import ProfileFrontContent from "@/components/profile/ProfileFrontContent";
import ProfileBackContent from "@/components/profile/ProfileBackContent";
import { useEffect } from "react";

const ProfileBox = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session check error:", error);
          navigate('/login');
          return;
        }
        if (!session) {
          console.log("No valid session found");
          navigate('/login');
          return;
        }
      } catch (error) {
        console.error("Error checking session:", error);
        navigate('/login');
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      console.log("Auth state changed in ProfileBox:", event);
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: profile, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error("Session error in profile query:", sessionError);
          throw sessionError;
        }
        
        if (!session) {
          console.log("No valid session in profile query");
          navigate('/login');
          return null;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        return profileData;
      } catch (error) {
        console.error("Profile query error:", error);
        throw error;
      }
    },
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

  if (isError) {
    return (
      <div className="h-[450px] w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Failed to load profile</p>
          <button 
            onClick={() => navigate('/login')} 
            className="mt-4 text-sm text-blue-500 hover:underline"
          >
            Return to login
          </button>
        </div>
      </div>
    );
  }

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