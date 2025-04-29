import React, { useEffect, useRef } from "react";
import { TouchableWithoutFeedback, Animated, Text, View, StyleSheet } from "react-native";

interface ReactionButtonProps {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
}

export const ReactionButton: React.FC<ReactionButtonProps> = ({
  label,
  count,
  active,
  onPress,
}) => {
  const scaleAnim = useRef(() => new Animated.Value(1)).current();
  const borderColorAnim = useRef(() => new Animated.Value(active ? 1 : 0)).current();

  useEffect(() => {
    Animated.timing(borderColorAnim, {
      toValue: active ? 1 : 0,
      duration: 400,
      useNativeDriver: false, // ✅ Always false for colors
    }).start();
  }, [active]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true, // ✅ Always true for transforms
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  const interpolatedBorderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#eee", "lightsteelblue"],
  });

  const animatedButtonStyle = {
    transform: [{ scale: scaleAnim }],
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Animated.View style={[styles.button, animatedButtonStyle, { borderColor: interpolatedBorderColor }]}>
        <Text style={styles.text}>
          {label} {count}
        </Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
  },
});
