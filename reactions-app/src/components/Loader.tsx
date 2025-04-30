import React, { FC } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export const Loader: FC = () => (
  <View style={styles.loaderContainer}>
    <ActivityIndicator size="small" color="#0000ff" />
  </View>
);

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 340,
  },
});
