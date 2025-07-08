import { toast } from "@/hooks/use-toast";

export const showErrorNotification = (title: string, description?: string) => {
  toast({
    title,
    description,
    variant: "destructive",
  });
};

export const showSuccessNotification = (title: string, description?: string) => {
  toast({
    title,
    description,
  });
};

export const showWarningNotification = (title: string, description?: string) => {
  toast({
    title,
    description,
    variant: "destructive",
  });
};