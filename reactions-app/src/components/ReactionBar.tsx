import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { components, operations } from "../types/api"; // types you generated
import { addReaction, removeReaction } from "../api/reactions"; // your axios functions
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ReactionType =
  operations["ReactionsController_addReaction"]["parameters"]["path"]["reactionType"];

interface ReactionBarProps {
  itemId: string;
  userId: string;
  reactions: components["schemas"]["ReactionResponseDto"];
}

const REACTIONS: ReactionType[] = ["LOVE", "FIRE", "ADMIRE", "CLAP"];

const REACTION_EMOJIS: Record<ReactionType, string> = {
  LOVE: "❤️",
  FIRE: "🔥",
  ADMIRE: "✨",
  CLAP: "👏",
};

export const ReactionBar = ({
  itemId,
  userId,
  reactions,
}: ReactionBarProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
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

  const handlePress = (type: ReactionType) => {
    const alreadyReacted = reactions[type]?.hasReacted ?? false;
    mutation.mutate({ type, active: alreadyReacted });
  };

  return (
    <View style={styles.container}>
      {REACTIONS.map((reaction) => {
        const count = reactions[reaction]?.count ?? 0;
        const hasReacted = reactions[reaction]?.hasReacted ?? false;

        return (
          <TouchableOpacity
            key={reaction}
            style={[styles.reaction, hasReacted && styles.active]}
            onPress={() => handlePress(reaction)}
          >
            <Text style={styles.text}>
              {REACTION_EMOJIS[reaction]} {count}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 8,
    justifyContent: "center",
  },
  reaction: {
    padding: 8,
    marginHorizontal: 5,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  active: {
    backgroundColor: "gold",
  },
  text: {
    fontSize: 16,
  },
});
