import React, { useEffect, useRef } from "react";
import { TouchableWithoutFeedback, Animated, Text, StyleSheet } from "react-native";

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
  const scale = useRef(new Animated.Value(1)).current;
  const backgroundColor = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(backgroundColor, {
      toValue: active ? 1 : 0,
      duration: 400, // smooth transition
      useNativeDriver: true,
    }).start();
  }, [active]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  const bgColor = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["#eee", "gold"],
  });

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Animated.View style={[styles.button, { backgroundColor: bgColor, transform: [{ scale }] }]}>
        <Text style={styles.text}>
          {label} {count}
        </Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
  },
});
