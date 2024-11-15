import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";

const ProfileBox = () => {
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

  return (
    <div className="relative h-[450px] w-full">
      <div className="absolute inset-0 rounded-xl border-4 border-zinc-200 overflow-hidden">
        <img
          src="https://www.brandpublic.agency/wp-content/uploads/2024/11/cee34d9e-f5bc-42ee-8530-9e4e55a1a702.jpeg"
          alt="Profile Cover"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg">
        <User className="h-5 w-5 text-zinc-600" />
        <span className="text-sm font-medium text-zinc-900">
          {profile?.full_name || 'Welcome'}
        </span>
      </div>
    </div>
  );
};

export default ProfileBox;