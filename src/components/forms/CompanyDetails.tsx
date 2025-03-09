
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import CompanyDetailsFields from "./CompanyDetailsFields";

interface CompanyDetailsProps {
  form: UseFormReturn<any>;
  onSubmit?: (data: any) => Promise<void>;
  showSubmit?: boolean;
  isEditing?: boolean;
}

const CompanyDetails = ({ 
  form, 
  onSubmit, 
  showSubmit,
  isEditing: externalIsEditing
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
      // Preserve venues field from form.getValues() to ensure it's included in submission
      const formValues = form.getValues();
      const dataWithVenues = {
        ...data,
        venues: formValues.venues || []
      };
      
      console.log("Submitting company details with venues:", dataWithVenues.venues);
      await onSubmit(dataWithVenues);
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
