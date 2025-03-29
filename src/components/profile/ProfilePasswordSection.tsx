
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
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
    <div className="pt-6 border-t border-slate-100">
      <h3 className="text-xl font-semibold text-slate-800 mb-4">
        {!hasPassword ? 'Set Password' : 'Password Settings'}
      </h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePasswordUpdate)} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-slate-600">
                    {!hasPassword ? "New Password" : "Change Password"}
                  </FormLabel>
                  <div className="flex items-center space-x-3 p-3 bg-white border border-slate-200 rounded-lg">
                    <Lock className="h-5 w-5 text-slate-400" />
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter password" 
                        className="border-none focus-visible:ring-0 bg-transparent p-0 h-7"
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
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-slate-600">Confirm Password</FormLabel>
                  <div className="flex items-center space-x-3 p-3 bg-white border border-slate-200 rounded-lg">
                    <Lock className="h-5 w-5 text-slate-400" />
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Confirm password" 
                        className="border-none focus-visible:ring-0 bg-transparent p-0 h-7"
                        {...field} 
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>
          
          <Button 
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white"
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
            <div className="flex items-start mt-4 p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
              <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5 shrink-0" />
              <p className="text-sm">
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
