import { Card } from "@/components/ui/card";

const ProfileBox = () => {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full">
        <img
          src="https://www.brandpublic.agency/wp-content/uploads/2024/11/wk.jpg"
          alt="Profile"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold">User Profile</h2>
        <p className="text-gray-600">Full Name: Jane Doe</p>
        <p className="text-gray-600">Email: jane.doe@example.com</p>
        <p className="text-gray-600">Role: User</p>
      </div>
    </Card>
  );
};

export default ProfileBox;
