import React from "react";
import { View, Image, ActivityIndicator, Text, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getReactions } from "../api/reactions";
import { ReactionBar } from "../components/ReactionBar";

interface ImageWithReactionsProps {
  itemId: string;
  userId: string;
  imageUrl: string;
}

export default function ImageWithReactions({
  itemId,
  userId,
  imageUrl,
}: ImageWithReactionsProps) {
  const { data: reactions, isLoading } = useQuery({
    queryKey: ["reactions", itemId],
    queryFn: () => getReactions(itemId, userId),
  });

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  }

  if (!reactions) {
    return (
      <View style={styles.loaderContainer}>
        <Text>No reactions yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <ReactionBar itemId={itemId} userId={userId} reactions={reactions} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 5,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 12,
    marginBottom: 5,
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 340,
  },
});
