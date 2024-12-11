import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileForm from "@/components/profile/ProfileForm";
import TeamManagement from "@/components/profile/TeamManagement";
import CompanyDetails from "@/components/forms/CompanyDetails";
import Header from "@/components/Header";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Building, Users } from "lucide-react";
import FormSection from "@/components/forms/FormSection";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  company_name: z.string().optional(),
  contact_person: z.string().optional(),
  contact_number: z.string().optional(),
  company_vat: z.string().optional(),
  street_address: z.string().optional(),
  suburb: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    surname: "",
    mobile: "",
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: "",
      contact_person: "",
      contact_number: "",
      company_vat: "",
      street_address: "",
      suburb: "",
      city: "",
      postal_code: "",
    },
  });

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please try logging in again.",
        });
        navigate("/login");
        return;
      }
      if (!session) {
        navigate("/login");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Authentication error');
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      return profileData;
    },
    retry: 1,
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error loading profile",
        description: "Please try refreshing the page.",
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update(editForm)
      .eq('id', user.id);

    if (!error) {
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h3 className="text-lg font-medium">Error loading profile</h3>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className="flex-1 space-y-8 overflow-hidden p-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Profile & Settings</h2>
          <p className="text-muted-foreground">
            Manage your profile information and team settings
          </p>
        </div>

        <Tabs defaultValue="profile" className="h-full space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="h-full">
            <ScrollArea className="h-full">
              <Card className="p-6">
                <ProfileForm
                  profile={profile}
                  isEditing={isEditing}
                  editForm={editForm}
                  setEditForm={setEditForm}
                  handleEdit={handleEdit}
                  handleSave={handleSave}
                />
              </Card>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="company" className="h-full">
            <ScrollArea className="h-full">
              <FormSection
                title="Company Details"
                description="Manage your company information"
                icon={<Building className="h-5 w-5" />}
              >
                <CompanyDetails form={form} />
              </FormSection>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="team" className="h-full">
            <ScrollArea className="h-full">
              <FormSection
                title="Team Management"
                description="Manage your team members and their roles"
                icon={<Users className="h-5 w-5" />}
              >
                <TeamManagement />
              </FormSection>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileSettings;