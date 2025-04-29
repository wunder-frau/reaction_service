import React, { useEffect, useRef, useState,  useReducer } from "react";
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
	const countOpacity = useSharedValue(0);

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

useEffect(() => {
  countOpacity.value = withSequence(
    withTiming(0.5, { duration: 100 }),
    withTiming(1, { duration: 150 })
  );
}, [reactions[label]]);


const handlePress = () => {
    if (!wasActive.current) {
      dispatch({ type: "increment", reaction: label }); 
      // Only animate scale if adding a reaction
      scale.value = withSequence(
        withTiming(1.2, { duration: 150 }),
        withTiming(1, { duration: 250 })
      );
  
      spawnMultipleFloatingEmojis(); // only when adding
    } else {
			dispatch({ type: "decrement", reaction: label }); // 👈 decrement when removing!
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
      ["#eee", "lightsteelblue"],
    );

    return {
      transform: [{ scale: scale.value }],
      borderColor,
    };
  });

	// Animated style
const animatedCountStyle = useAnimatedStyle(() => {
  return {
    opacity: countOpacity.value,
		fontWeight: borderColorProgress.value > 0.5 ? "bold" : "normal",
		fontSize: borderColorProgress.value > 0.5 ? 18 : 16,
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
						<Animated.Text style={[styles.count, animatedCountStyle]}>
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
    paddingHorizontal: 8,
    marginHorizontal: 8,
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
		color: "lightsteelblue",
  },
});
