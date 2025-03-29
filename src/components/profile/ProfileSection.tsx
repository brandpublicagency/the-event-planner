import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, Save, Edit, Lock, Info, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
interface ProfileSectionProps {
  profile: {
    id: string;
    full_name: string | null;
    surname: string | null;
    mobile: string | null;
    email: string | null;
    avatar_url: string | null;
    updated_at: string;
  } | null;
  isEditing: boolean;
  editForm: {
    full_name: string;
    surname: string;
    mobile: string;
  };
  setEditForm: (form: {
    full_name: string;
    surname: string;
    mobile: string;
  }) => void;
  handleEdit: () => void;
  handleSave: () => void;
  hasPassword: boolean;
}
const passwordSchema = z.object({
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long"
  }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
const ProfileSection = ({
  profile,
  isEditing,
  editForm,
  setEditForm,
  handleEdit,
  handleSave,
  hasPassword
}: ProfileSectionProps) => {
  const [userEmail, setUserEmail] = useState(profile?.email || "");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const {
    toast
  } = useToast();
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });
  const handlePasswordUpdate = async (values: z.infer<typeof passwordSchema>) => {
    try {
      setIsPasswordLoading(true);
      const {
        error
      } = await supabase.auth.updateUser({
        password: values.password
      });
      if (error) throw error;
      const {
        error: updateError
      } = await supabase.auth.updateUser({
        data: {
          has_set_password: true
        }
      });
      if (updateError) {
        console.error("Error updating user metadata:", updateError);
      }
      form.reset();
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Error updating password"
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Personal Information</h3>
        {isEditing ? <Button onClick={handleSave} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button> : <Button variant="outline" onClick={handleEdit} size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>}
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
          <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{userEmail || 'Not set'}</p>
          </div>
        </div>

        {isEditing ? <div className="grid gap-4">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <User className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <Input value={editForm.full_name} onChange={e => setEditForm({
              ...editForm,
              full_name: e.target.value
            })} placeholder="First name" className="border-none p-0 h-7 focus-visible:ring-0 bg-transparent" />
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <User className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <Input value={editForm.surname} onChange={e => setEditForm({
              ...editForm,
              surname: e.target.value
            })} placeholder="Surname" className="border-none p-0 h-7 focus-visible:ring-0 bg-transparent" />
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <Input value={editForm.mobile} onChange={e => setEditForm({
              ...editForm,
              mobile: e.target.value
            })} placeholder="Mobile number" className="border-none p-0 h-7 focus-visible:ring-0 bg-transparent" />
              </div>
            </div>
          </div> : <div className="grid gap-4">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <User className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{profile?.full_name || 'Not set'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <User className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{profile?.surname || 'Not set'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{profile?.mobile || 'Not set'}</p>
              </div>
            </div>
          </div>}
      </div>

      <div className="pt-4 border-t">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          {!hasPassword ? 'Set Password' : 'Password Settings'}
        </h3>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handlePasswordUpdate)} className="space-y-4">
            <FormField control={form.control} name="password" render={({
            field
          }) => <FormItem>
                  <div className="flex items-center space-x-3">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    <FormControl>
                      <Input type="password" placeholder={!hasPassword ? "New Password" : "Change Password"} {...field} />
                    </FormControl>
                  </div>
                </FormItem>} />
            
            <FormField control={form.control} name="confirmPassword" render={({
            field
          }) => <FormItem>
                  <div className="flex items-center space-x-3">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    <FormControl>
                      <Input type="password" placeholder="Confirm Password" {...field} />
                    </FormControl>
                  </div>
                </FormItem>} />
            
            <Button type="submit" className="w-full mt-2" disabled={!form.formState.isDirty || isPasswordLoading}>
              {isPasswordLoading ? <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </> : !hasPassword ? 'Set Password' : 'Update Password'}
            </Button>
            
            {!hasPassword && <div className="flex items-start mt-4 p-3 bg-white rounded-lg border border-black/20 py-[10px] px-[8px]">
                <Info className="h-5 w-5 text-zinc-700 mr-3 mt-0.5 shrink-0" />
                <p className="text-zinc-700 text-xs my-[3px]">
                  Setting a password will allow you to login with your email and password in the future.
                </p>
              </div>}
          </form>
        </Form>
      </div>
    </div>;
};
export default ProfileSection;