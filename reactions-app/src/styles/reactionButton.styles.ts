import { StyleSheet } from "react-native";

export const reactionButtonStyles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  floatingLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    zIndex: 2,
  },
  button: {
    width: 60,
    paddingVertical: 6,
    paddingHorizontal: 6,
    marginHorizontal: 6,
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: "ivory",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  emoji: {
    fontSize: 24,
    marginRight: 0,
  },
  count: {
    fontSize: 16,
    color: "steelblue",
  },
});
