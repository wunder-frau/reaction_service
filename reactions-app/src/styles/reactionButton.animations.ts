import {
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

export const useAnimatedButtonStyle = (
  scale: SharedValue<number>,
  borderColorProgress: SharedValue<number>,
  disabled: boolean
) => {
  const lightColor = "#eee";
  const darkColor = "steelblue";

  return useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      borderColorProgress.value,
      [0, 1],
      [lightColor, darkColor]
    );
    return {
      borderColor,
      opacity: disabled ? 0.5 : 1,
    };
  });
};

export const useAnimatedCountStyle = (
  countOpacity: SharedValue<number>,
  borderColorProgress: SharedValue<number>
) => {
  return useAnimatedStyle(() => {
    return {
      opacity: countOpacity.value,
      fontWeight: borderColorProgress.value > 0.5 ? "bold" : "normal",
      fontSize: borderColorProgress.value > 0.5 ? 18 : 16,
    };
  });
};
