import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  interpolateColor,
} from "react-native-reanimated";
import { FloatingEmoji } from "./FloatingEmoji";

interface ReactionButtonProps {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
  disabled?: boolean;
}

interface FlyingEmoji {
  id: number;
  offsetX: number;
  duration: number;
}

export const ReactionButton: React.FC<ReactionButtonProps> = ({
  label,
  count,
  active,
  onPress,
  disabled = false,
}) => {
  const scale = useSharedValue(1);
  const borderColorProgress = useSharedValue(active ? 1 : 0);
  const countOpacity = useSharedValue(1);
  const [flyingEmojis, setFlyingEmojis] = useState<FlyingEmoji[]>([]);

  const wasActive = useRef(active);

  useEffect(() => {
    borderColorProgress.value = withTiming(active ? 1 : 0, { duration: 400 });
    wasActive.current = active;
  }, [active]);

  useEffect(() => {
    countOpacity.value = withSequence(
      withTiming(0.5, { duration: 100 }),
      withTiming(1, { duration: 150 })
    );
  }, [count]);

  const handlePress = () => {
    if (disabled) return;

    // Only animate and float emojis if it's a new reaction
    if (!wasActive.current) {
      scale.value = withSequence(
        withTiming(1.2, { duration: 150 }),
        withTiming(1, { duration: 250 })
      );
      spawnMultipleFloatingEmojis();
    }

    wasActive.current = !wasActive.current;
    onPress();
  };

  const spawnMultipleFloatingEmojis = () => {
    const newEmojis: FlyingEmoji[] = [];

    for (let i = 0; i < 5; i++) {
      newEmojis.push({
        id: Math.random(),
        offsetX: Math.random() * 60 - 30,
        duration: 800 + Math.random() * 600,
      });
    }

    setFlyingEmojis((current) => [...current, ...newEmojis]);
  };

  const handleEmojiFinish = (id: number) => {
    setFlyingEmojis((current) => current.filter((emoji) => emoji.id !== id));
  };

  const animatedButtonStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      borderColorProgress.value,
      [0, 1],
      ["#eee", "steelblue"]
    );
    return {
      transform: [{ scale: scale.value }],
      borderColor,
      opacity: disabled ? 0.5 : 1,
    };
  });

  const animatedCountStyle = useAnimatedStyle(() => {
    return {
      opacity: countOpacity.value,
      fontWeight: borderColorProgress.value > 0.5 ? "bold" : "normal",
      fontSize: borderColorProgress.value > 0.5 ? 18 : 16,
    };
  });

  return (
    <Pressable onPress={handlePress} disabled={disabled}>
      <View style={styles.wrapper}>
        <View style={styles.floatingLayer}>
          {flyingEmojis.map((emoji) => (
            <FloatingEmoji
              key={emoji.id}
              emoji={label}
              offsetX={emoji.offsetX}
              duration={emoji.duration}
              onFinish={() => handleEmojiFinish(emoji.id)}
            />
          ))}
        </View>
        <Animated.View style={[styles.button, animatedButtonStyle]}>
          <View style={styles.content}>
            <Text style={styles.emoji}>{label}</Text>
						{count > 0 && (
							<Animated.Text style={[styles.count, animatedCountStyle]}>
								{count}
							</Animated.Text>
						)}
          </View>
        </Animated.View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
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
