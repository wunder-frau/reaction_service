import React, { useEffect, useRef, useState, useReducer } from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  interpolateColor,
} from "react-native-reanimated";
import {
  reactionReducer,
  ReactionState,
  ReactionAction,
} from "@/reducers/reactionReducer";
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
  const [reactions, dispatch] = useReducer(reactionReducer, {
    [label]: count,
  });

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
  }, [reactions[label]]);

  const handlePress = () => {
    if (!wasActive.current) {
      dispatch({ type: "increment", reaction: label });

      scale.value = withSequence(
        withTiming(1.2, { duration: 150 }),
        withTiming(1, { duration: 250 })
      );

      spawnMultipleFloatingEmojis();
    } else {
      dispatch({ type: "decrement", reaction: label });
    }
    onPress();
    wasActive.current = !wasActive.current;
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
      ["#eee", "lightsteelblue"]
    );

    return {
      transform: [{ scale: scale.value }],
      borderColor,
    };
  });

  const animatedCountStyle = useAnimatedStyle(() => {
    return {
      opacity: countOpacity.value,
      fontSize: withTiming(borderColorProgress.value > 0.5 ? 18 : 16, { duration: 300 }),
    };
  });

  // WebSocket connection!
  useEffect(() => {
    const socket = new WebSocket('ws://192.168.1.152:3001'); // or replace localhost with IP if on device

    socket.onopen = () => {
      console.log('✅ WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('📨 WebSocket update:', data);

      if (data.imageId && data.reactions) {
        dispatch({ type: "sync", reactions: data.reactions });
      }
    };

    socket.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('🔌 WebSocket disconnected');
    };

    return () => {
      socket.close();
    };
  }, []);

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
            <Animated.Text
              style={[
                styles.count,
                animatedCountStyle,
                { fontWeight: active ? "bold" : "normal" },
              ]}
            >
              {reactions[label]}
            </Animated.Text>
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    zIndex: 2,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginHorizontal: 8,
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
    marginRight: 6,
  },
  count: {
    fontSize: 16,
    color: "lightsteelblue",
  },
});
