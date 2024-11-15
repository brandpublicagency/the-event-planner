import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const quotes = [
  "Make each day your masterpiece",
  "Embrace the journey, not just the destination",
  "The best time for new beginnings is now",
  "Dream big, work hard, stay focused",
  "Your attitude determines your direction"
];

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

  // Get a random quote
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="relative h-[200px] w-full">
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
          alt="Profile Cover"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white text-sm font-medium text-center italic">
            "{randomQuote}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileBox;