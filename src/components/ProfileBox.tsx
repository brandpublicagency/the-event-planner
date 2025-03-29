
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import FlipCard from "@/components/FlipCard";
import ProfileFrontContent from "@/components/profile/ProfileFrontContent";
import ProfileBackContent from "@/components/profile/ProfileBackContent";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileBox = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ['auth-session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  useEffect(() => {
    if (!isSessionLoading && !session) {
      navigate('/login');
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, session, isSessionLoading]);

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return profileData;
    },
    enabled: !!session?.user?.id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
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

  if (isSessionLoading || isProfileLoading) {
    return (
      <div className="h-[450px] w-full space-y-4 p-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!session || !profile) {
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
        className="border border-black/10"
      />
    </div>
  );
};

export default ProfileBox;
