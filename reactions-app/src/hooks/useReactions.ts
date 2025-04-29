import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addReaction, removeReaction, getReactions } from "../api/reactions";
import { ReactionResponse, ReactionType } from "../constants/reactions";

export const useGetReactions = (itemId: string, userId?: string) => {
  return useQuery({
    queryKey: ["reactions", itemId],
    queryFn: () => getReactions(itemId, userId),
  });
};

export const useAddOrRemoveReaction = (itemId: string, userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      type,
      active,
    }: {
      type: ReactionType;
      active: boolean;
    }) => {
      if (active) {
        return removeReaction(itemId, type, userId);
      } else {
        return addReaction(itemId, type, userId);
      }
    },
    onMutate: async ({ type }) => {
      await queryClient.cancelQueries({ queryKey: ["reactions", itemId] });

      const previousReactions = queryClient.getQueryData(["reactions", itemId]);

      queryClient.setQueryData(
        ["reactions", itemId],
        (old: ReactionResponse) => {
          const prev = old?.[type] || { count: 0, hasReacted: false };
          const updatedCount = prev.hasReacted
            ? prev.count - 1
            : prev.count + 1;

          return {
            ...old,
            [type]: {
              count: Math.max(updatedCount, 0),
              hasReacted: !prev.hasReacted,
            },
          };
        }
      );

      return { previousReactions };
    },
    onError: (err, variables, context) => {
      if (context?.previousReactions) {
        queryClient.setQueryData(
          ["reactions", itemId],
          context.previousReactions
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["reactions", itemId] });
    },
  });
};
