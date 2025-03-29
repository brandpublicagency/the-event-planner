
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Info, Lock, Loader2 } from "lucide-react";

// Schema for password change
const passwordSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface ProfilePasswordSectionProps {
  hasPassword: boolean;
}

const ProfilePasswordSection = ({ hasPassword }: ProfilePasswordSectionProps) => {
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const { toast } = useToast();
  
  // Setup form for password reset
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handlePasswordUpdate = async (values: z.infer<typeof passwordSchema>) => {
    try {
      setIsPasswordLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) throw error;
      
      // Mark that user has set a password
      const { error: updateError } = await supabase.auth.updateUser({
        data: { has_set_password: true }
      });
      
      if (updateError) {
        console.error("Error updating user metadata:", updateError);
      }
      
      // Clear form on success
      form.reset();
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Error updating password",
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="pt-4 border-t">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        {!hasPassword ? 'Set Password' : 'Password Settings'}
      </h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePasswordUpdate)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder={!hasPassword ? "New Password" : "Change Password"}
                      className="border-none p-0 h-7 focus-visible:ring-0 bg-transparent"
                      {...field} 
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Confirm Password"
                      className="border-none p-0 h-7 focus-visible:ring-0 bg-transparent"
                      {...field} 
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          
          <Button 
            type="submit"
            className="w-full mt-2"
            disabled={!form.formState.isDirty || isPasswordLoading}
          >
            {isPasswordLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              !hasPassword ? 'Set Password' : 'Update Password'
            )}
          </Button>
          
          {!hasPassword && (
            <div className="flex items-start mt-4 p-3 bg-blue-50 rounded-lg">
              <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5 shrink-0" />
              <p className="text-sm text-blue-700">
                Setting a password will allow you to login with your email and password in the future.
              </p>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default ProfilePasswordSection;
