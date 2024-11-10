import { useState } from "react";
import { Card } from "@/components/ui/card";
import FlipCard from "@/components/FlipCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, Edit2, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

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

  const { data: profile, refetch } = useQuery({
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
    <div className="h-full flex flex-col">
      <div className="aspect-video w-full h-full relative">
        <img
          src="https://www.brandpublic.agency/wp-content/uploads/2024/11/wk.jpg"
          alt="Profile"
          className="h-full w-full object-cover"
        />
        <h2 className="text-2xl font-semibold text-white absolute bottom-4 left-4">
          {profile?.full_name || 'Loading...'}
        </h2>
      </div>
    </div>
  );

  const backContent = (
    <div className="p-6 flex flex-col h-full bg-gradient-to-br from-zinc-50 to-white">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Profile Details</h3>
        {!isEditing ? (
          <Button variant="ghost" size="icon" onClick={handleEdit}>
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={handleSave}>
            <Save className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="space-y-4 flex-1">
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={editForm.full_name}
                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Surname</label>
              <Input
                value={editForm.surname}
                onChange={(e) => setEditForm({ ...editForm, surname: e.target.value })}
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mobile</label>
              <Input
                value={editForm.mobile}
                onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                className="bg-white"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium text-gray-900">Full Name:</span> {profile?.full_name}
            </p>
            <p className="text-gray-600">
              <span className="font-medium text-gray-900">Surname:</span> {profile?.surname}
            </p>
            <p className="text-gray-600">
              <span className="font-medium text-gray-900">Mobile:</span> {profile?.mobile}
            </p>
          </div>
        )}
        
        <div className="mt-8">
          <h4 className="text-lg font-medium mb-4">Documents</h4>
          <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
            <label className="flex flex-col items-center cursor-pointer">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Upload PDFs (max 3)</span>
              <input
                type="file"
                multiple
                accept=".pdf"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-[450px]">
      <FlipCard front={frontContent} back={backContent} />
    </div>
  );
};

export default ProfileBox;
