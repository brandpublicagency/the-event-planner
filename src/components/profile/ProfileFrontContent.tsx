import { Profile } from "@/types/profile";

interface ProfileFrontContentProps {
  profile: Profile | null;
}

const ProfileFrontContent = ({ profile }: ProfileFrontContentProps) => {
  return (
    <div className="h-full">
      <div className="relative h-full">
        <img
          src="https://www.brandpublic.agency/wp-content/uploads/2024/11/cee34d9e-f5bc-42ee-8530-9e4e55a1a702.jpeg"
          alt="Profile Cover"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
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
};

export default ProfileFrontContent;