import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import CompanyDetailsFields from "./CompanyDetailsFields";

interface CompanyDetailsProps {
  form: UseFormReturn<any>;
  onSubmit?: (data: any) => Promise<void>;
  showSubmit?: boolean;
  isEditing?: boolean; // Add this prop
}

const CompanyDetails = ({ 
  form, 
  onSubmit, 
  showSubmit,
  isEditing: externalIsEditing // Receive external editing state
}: CompanyDetailsProps) => {
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  
  // Use external editing state if provided, otherwise use internal state
  const isEditing = externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;

  const handleEditToggle = () => {
    setInternalIsEditing(!internalIsEditing);
  };

  const handleSubmit = async (data: any) => {
    if (!onSubmit) return;
    
    try {
      await onSubmit(data);
      setInternalIsEditing(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <CompanyDetailsFields form={form} isEditing={isEditing} />

        {showSubmit && !externalIsEditing && (
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