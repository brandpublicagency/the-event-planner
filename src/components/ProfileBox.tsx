import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import FlipCard from "@/components/FlipCard";
import ProfileForm from "@/components/profile/ProfileForm";
import DocumentUpload from "@/components/profile/DocumentUpload";

const ProfileBox = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  
  const [editForm, setEditForm] = useState({
    full_name: "",
    surname: "",
    mobile: "",
  });

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

  const updateProfileMutation = useMutation({
    mutationFn: async (updateData: typeof editForm) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleEdit = () => {
    setEditForm({
      full_name: profile?.full_name || "",
      surname: profile?.surname || "",
      mobile: profile?.mobile || "",
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    updateProfileMutation.mutate(editForm);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    if (files.length > 3) {
      toast({
        title: "Error",
        description: "You can only upload up to 3 PDF files",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      for (const file of files) {
        if (file.type !== 'application/pdf') {
          toast({
            title: "Error",
            description: "Only PDF files are allowed",
            variant: "destructive",
          });
          continue;
        }

        const filename = `${crypto.randomUUID()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('pdfs')
          .upload(filename, file);

        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase
          .from('pdf_files')
          .insert({
            user_id: profile?.id,
            filename: file.name,
            file_path: filename,
          });

        if (dbError) throw dbError;

        toast({
          title: "Success",
          description: `${file.name} uploaded successfully`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const frontContent = (
    <div className="h-full">
      <div className="relative h-full">
        <img
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
          alt="Profile"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          <h2 className="text-2xl font-semibold text-white">
            {profile?.full_name || 'Loading...'}
          </h2>
        </div>
      </div>
    </div>
  );

  const backContent = (
    <div className="flex h-full flex-col space-y-6">
      <ProfileForm
        profile={profile}
        isEditing={isEditing}
        editForm={editForm}
        setEditForm={setEditForm}
        handleEdit={handleEdit}
        handleSave={handleSave}
      />
      <DocumentUpload
        handleFileUpload={handleFileUpload}
        uploading={uploading}
      />
    </div>
  );

  return (
    <div className="h-[450px]">
      <FlipCard front={frontContent} back={backContent} />
    </div>
  );
};

export default ProfileBox;