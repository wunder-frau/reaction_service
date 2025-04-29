import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addReaction, removeReaction, getReactions } from "../api/reactions";
import { operations } from "../types/api";

type ReactionType =
  operations["ReactionsController_addReaction"]["parameters"]["path"]["reactionType"];

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reactions", itemId] });
    },
  });
};
