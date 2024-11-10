import { Card } from "@/components/ui/card";
import FlipCard from "@/components/FlipCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ProfileBox = () => {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Get user profile
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      return profileData;
    },
  });

  const frontContent = (
    <div className="h-full flex flex-col">
      <div className="aspect-video w-full">
        <img
          src="https://www.brandpublic.agency/wp-content/uploads/2024/11/wk.jpg"
          alt="Profile"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-4 flex-1 flex items-center justify-center">
        <h2 className="text-2xl font-semibold">{profile?.full_name || 'Loading...'}</h2>
      </div>
    </div>
  );

  const backContent = (
    <div className="p-6 flex flex-col justify-center h-full">
      <h3 className="text-lg font-semibold mb-4">Profile Details</h3>
      <div className="space-y-2">
        <p className="text-gray-600">Full Name: {profile?.full_name}</p>
        <p className="text-gray-600">Surname: {profile?.surname}</p>
        <p className="text-gray-600">Mobile: {profile?.mobile}</p>
      </div>
    </div>
  );

  return (
    <div className="h-[600px]">
      <FlipCard front={frontContent} back={backContent} />
    </div>
  );
};

export default ProfileBox;