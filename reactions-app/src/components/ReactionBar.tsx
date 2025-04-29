import { useState } from "react";
import { View } from "react-native";
import { ReactionButton } from "../components/ReactionButton";
import { useAddOrRemoveReaction } from "../hooks/useReactions";
import { reactionBarStyles as styles } from "@/styles/reactionBar.styles";
import { REACTIONS, REACTION_EMOJIS, ReactionType, ReactionResponse } from "@/constants/reactions";

interface ReactionBarProps {
  itemId: string;
  userId: string;
  reactions: ReactionResponse;
}

export const ReactionBar: React.FC<ReactionBarProps> = ({ itemId, userId, reactions }) => {
  const mutation = useAddOrRemoveReaction(itemId, userId);
  const [pendingReaction, setPendingReaction] = useState<ReactionType | null>(null);

  const handlePress = (type: ReactionType) => {
    if (pendingReaction === type || mutation.isPending) return;

    const alreadyReacted = reactions[type]?.hasReacted ?? false;

    setPendingReaction(type);

    mutation.mutate(
      { type, active: alreadyReacted },
      {
        onSettled: () => {
          setPendingReaction(null);
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
            disabled={pendingReaction === reaction}
          />
        );
      })}
    </View>
  );
};
