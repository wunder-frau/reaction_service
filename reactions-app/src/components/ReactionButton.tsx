import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface ReactionButtonProps {
  label: string;        // emoji (e.g., "🔥")
  count: number;        // number of reactions (e.g., 3)
  active: boolean;      // whether the current user has reacted
  onPress: () => void;  // handler for toggling reaction
}

export const ReactionButton: React.FC<ReactionButtonProps> = ({
  label,
  count,
  active,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.button, active && styles.active]}
  >
    <Text style={styles.text}>
      {label} {count}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    padding: 8,
    marginHorizontal: 5,
    backgroundColor: "#eee",
    borderRadius: 10,
  },
  active: {
    backgroundColor: "gold",
  },
  text: {
    fontSize: 16,
  },
});
