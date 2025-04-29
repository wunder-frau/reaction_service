const Reanimated = require("react-native-reanimated/mock");

Reanimated.default = Reanimated;

Reanimated.View = "Animated.View";
Reanimated.Text = "Animated.Text";

Reanimated.useSharedValue = jest.fn(() => ({ value: 0 }));
Reanimated.useAnimatedStyle = jest.fn(() => ({}));
Reanimated.withTiming = jest.fn((v) => v);
Reanimated.withSequence = jest.fn((...args) => args[args.length - 1]);
Reanimated.interpolateColor = jest.fn(() => "#eee");

module.exports = Reanimated;
