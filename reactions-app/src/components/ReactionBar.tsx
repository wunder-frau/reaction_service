import { useAddOrRemoveReaction } from "../hooks/useReactions"; // ✅
import { View, StyleSheet } from "react-native";
import { ReactionButton } from "../components/ReactionButton";
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
  const mutation = useAddOrRemoveReaction(itemId, userId); // ✅

  const handlePress = (type: ReactionType) => {
    const alreadyReacted = reactions[type]?.hasReacted ?? false;
    mutation.mutate({ type, active: alreadyReacted });
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
