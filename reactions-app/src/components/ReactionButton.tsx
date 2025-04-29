import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { FloatingEmoji } from "./FloatingEmoji";
import { reactionButtonStyles as styles } from "../styles/reactionButton.styles";
import {
  useAnimatedButtonStyle,
  useAnimatedCountStyle,
} from "@/styles/reactionButton.animations";

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

  const animatedButtonStyle = useAnimatedButtonStyle(
    scale,
    borderColorProgress,
    disabled
  );
  const animatedCountStyle = useAnimatedCountStyle(
    countOpacity,
    borderColorProgress
  );

  const wasActive = useRef(active);

  useEffect(() => {
    borderColorProgress.value = withTiming(active ? 1 : 0, { duration: 400 });
    wasActive.current = active;
  }, [active, borderColorProgress]);

  useEffect(() => {
    countOpacity.value = withSequence(
      withTiming(0.5, { duration: 100 }),
      withTiming(1, { duration: 150 })
    );
  }, [count, countOpacity]);

  const handlePress = () => {
    if (disabled) return;

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
    const newEmojis: FlyingEmoji[] = Array.from({ length: 5 }).map(() => ({
      id: Math.random(),
      offsetX: Math.random() * 60 - 30,
      duration: 800 + Math.random() * 600,
    }));

    setFlyingEmojis((current) => [...current, ...newEmojis]);
  };

  const handleEmojiFinish = (id: number) => {
    setFlyingEmojis((current) => current.filter((emoji) => emoji.id !== id));
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
    >
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
