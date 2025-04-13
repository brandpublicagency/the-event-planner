
import { z } from 'zod';

export const menuItemFormSchema = z.object({
  label: z.string().min(1, "Name is required"),
  value: z.string().min(1, "Value is required"),
  category: z.string().nullable().optional(),
  choice_id: z.string().min(1, "Choice is required"),
});

export type MenuItemFormValues = z.infer<typeof menuItemFormSchema>;
