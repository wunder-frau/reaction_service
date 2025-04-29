import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { ReactionButton } from "../components/ReactionButton";
import { useAddOrRemoveReaction } from "../hooks/useReactions";
import { components, operations } from "../types/api";

type ReactionType = operations["ReactionsController_addReaction"]["parameters"]["path"]["reactionType"];
type ReactionResponse = components["schemas"]["ReactionResponseDto"];

interface ReactionBarProps {
  itemId: string;
  userId: string;
  reactions: ReactionResponse;
}

const REACTIONS: ReactionType[] = ["LOVE", "FIRE", "ADMIRE", "CLAP"];
const REACTION_EMOJIS: Record<ReactionType, string> = {
  LOVE: "❤️",
  FIRE: "🔥",
  ADMIRE: "✨",
  CLAP: "👏",
};

export const ReactionBar: React.FC<ReactionBarProps> = ({ itemId, userId, reactions }) => {
  const mutation = useAddOrRemoveReaction(itemId, userId);
  const [pendingReaction, setPendingReaction] = useState<ReactionType | null>(null);

  const handlePress = (type: ReactionType) => {
    // 🛡️ Block fast repeat taps on the same reaction
    if (pendingReaction === type || mutation.isPending) return;

    const alreadyReacted = reactions[type]?.hasReacted ?? false;

    setPendingReaction(type);

    mutation.mutate(
      { type, active: alreadyReacted },
      {
        onSettled: () => {
          setPendingReaction(null); // ✅ Unlock after server responds
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      {REACTIONS.map((reaction) => {
        const data = reactions[reaction] || { count: 0, hasReacted: false };
        return (
          <ReactionButton
            key={reaction}
            label={REACTION_EMOJIS[reaction]}
            count={data.count}
            active={data.hasReacted ?? false}
            onPress={() => handlePress(reaction)}
            disabled={pendingReaction === reaction} // ✅ Only disable tapped button
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
});
