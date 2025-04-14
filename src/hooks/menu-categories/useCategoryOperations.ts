
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategoryOrder, storeCategoryOrder } from '@/api/menu/menuItemsApi';
import { toast } from 'sonner';

export const useCategoryOperations = (choiceId: string | null, useCategorization: boolean) => {
  const queryClient = useQueryClient();

  // Fetch saved category order from database using React Query
  const { 
    data: savedCategoryOrder = [], 
    isLoading: isLoadingCategoryOrder 
  } = useQuery({
    queryKey: ['menu-choice-category-order', choiceId],
    queryFn: async () => {
      if (!choiceId || !useCategorization) return [];
      console.log("Fetching saved category order for choice:", choiceId);
      try {
        const order = await getCategoryOrder(choiceId);
        console.log("Received saved category order:", order);
        return order;
      } catch (error) {
        console.error("Error fetching category order:", error);
        toast.error("Failed to load category order");
        return [];
      }
    },
    enabled: !!choiceId && useCategorization,
    staleTime: 300000, // 5 minutes
  });

  // Create a mutation for updating category order
  const reorderCategoryMutation = useMutation({
    mutationFn: async (newOrder: string[]) => {
      if (!choiceId) throw new Error("No choice ID available");
      console.log(`Saving category order for choice ${choiceId}:`, newOrder);
      return await storeCategoryOrder(choiceId, newOrder);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-choice-category-order', choiceId] });
      toast.success("Category order saved");
    },
    onError: (error) => {
      console.error("Failed to save category order:", error);
      toast.error("Failed to save category order");
    }
  });

  return {
    savedCategoryOrder,
    isLoadingCategoryOrder,
    reorderCategoryMutation
  };
};
