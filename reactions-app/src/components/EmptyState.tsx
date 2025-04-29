import React, { FC } from "react";
import { View, Text, StyleSheet } from "react-native";

interface EmptyStateProps {
  message: string;
}

export const EmptyState: FC<EmptyStateProps> = ({ message }) => (
  <View style={styles.container}>
    <Text>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 340,
  },
});
