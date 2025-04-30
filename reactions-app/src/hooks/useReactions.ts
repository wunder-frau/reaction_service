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
      return active
        ? removeReaction(itemId, type, userId)
        : addReaction(itemId, type, userId);
    },
    onMutate: async ({ type, active }) => {
      await queryClient.cancelQueries({ queryKey: ["reactions", itemId] });

      const previousReactions = queryClient.getQueryData<ReactionResponse>([
        "reactions",
        itemId,
      ]);

      if (!previousReactions) return;

      const updated: ReactionResponse = {
        ...previousReactions,
        [type]: {
          count: active
            ? Math.max(previousReactions[type].count - 1, 0)
            : previousReactions[type].count + 1,
          hasReacted: !active,
        },
      };

      queryClient.setQueryData(["reactions", itemId], updated);

      return { previousReactions };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousReactions) {
        queryClient.setQueryData(
          ["reactions", itemId],
          context.previousReactions
        );
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["reactions", itemId], data);
    },
  });
};
