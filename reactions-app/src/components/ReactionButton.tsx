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
}) => {
  const scale = useSharedValue(1);
  const borderColorProgress = useSharedValue(active ? 1 : 0);

  const [flyingEmojis, setFlyingEmojis] = useState<FlyingEmoji[]>([]);

  const wasActive = useRef(active);

  useEffect(() => {
    borderColorProgress.value = withTiming(active ? 1 : 0, { duration: 400 });
    wasActive.current = active;
  }, [active]);

//   const handlePress = () => {
//     scale.value = withSequence(
//       withTiming(1.2, { duration: 150 }),
//       withTiming(1, { duration: 250 })
//     );

//     if (!wasActive.current) {
//       spawnMultipleFloatingEmojis();
//     }

//     onPress();
//   };
const handlePress = () => {
    if (!wasActive.current) {
      // Only animate scale if adding a reaction
      scale.value = withSequence(
        withTiming(1.2, { duration: 150 }),
        withTiming(1, { duration: 250 })
      );
  
      spawnMultipleFloatingEmojis(); // only when adding
    }
  
    onPress(); // fire the press callback
  
    // After firing, update wasActive manually
    wasActive.current = !wasActive.current;
  };
  

  const spawnMultipleFloatingEmojis = () => {
    const newEmojis: FlyingEmoji[] = [];

    for (let i = 0; i < 5; i++) {
      newEmojis.push({
        id: Math.random(),
        offsetX: Math.random() * 60 - 30, // fly left/right
        duration: 800 + Math.random() * 600, // random between 800ms and 1400ms
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
      ["#eee", "lightsteelblue"]
    );

    return {
      transform: [{ scale: scale.value }],
      borderColor,
    };
  });

  return (
    <Pressable onPress={handlePress}>
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
            <Text style={styles.count}>{count}</Text>
          </View>
        </Animated.View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  floatingLayer: {
    position: "absolute", // floating emojis layer
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    zIndex: 2, // ABOVE the button
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: "ivory",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // BELOW the floating emojis
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  emoji: {
    fontSize: 24,
    marginRight: 6,
  },
  count: {
    fontSize: 16,
  },
});
