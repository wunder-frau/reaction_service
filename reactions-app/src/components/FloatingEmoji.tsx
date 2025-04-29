import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

interface FloatingEmojiProps {
  emoji: string;
  offsetX: number;
  duration: number;
  onFinish: () => void;
}

export const FloatingEmoji: React.FC<FloatingEmojiProps> = ({
  emoji,
  offsetX,
  duration,
  onFinish,
}) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateY.value = withTiming(-100, { duration });
    translateX.value = withTiming(offsetX, { duration });
    opacity.value = withTiming(0, { duration });
    scale.value = withTiming(1.5, { duration }, (finished) => {
      if (finished) {
        runOnJS(onFinish)();
      }
    });
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.Text style={[styles.floatingEmoji, animatedStyle]}>
      {emoji}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  floatingEmoji: {
    position: "absolute",
    fontSize: 24,
    top: 0,
    alignSelf: "center",
  },
});
