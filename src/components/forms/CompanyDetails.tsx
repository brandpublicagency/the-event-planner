import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import CompanyDetailsFields from "./CompanyDetailsFields";

interface CompanyDetailsProps {
  form: UseFormReturn<any>;
  onSubmit?: (data: any) => Promise<void>;
  showSubmit?: boolean;
}

const CompanyDetails = ({ form, onSubmit, showSubmit }: CompanyDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (data: any) => {
    if (!onSubmit) return;
    
    try {
      await onSubmit(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error; // Re-throw to be handled by the parent component
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <CompanyDetailsFields form={form} isEditing={isEditing} />

        {showSubmit && (
          <div className="flex justify-end space-x-4">
            {!isEditing ? (
              <Button 
                type="button" 
                onClick={handleEditToggle}
              >
                Edit Company Details
              </Button>
            ) : (
              <>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleEditToggle}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Company Details
                </Button>
              </>
            )}
          </div>
        )}
      </form>
    </Form>
  );
};

export default CompanyDetails;