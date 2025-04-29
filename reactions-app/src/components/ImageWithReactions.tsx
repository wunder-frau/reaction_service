import React, { FC, memo } from "react";
import { View, Image, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getReactions } from "../api/reactions";
import { ReactionBar } from "../components/ReactionBar";
import { Loader } from "./Loader";
import { EmptyState } from "./EmptyState";

interface ImageWithReactionsProps {
  itemId: string;
  userId: string;
  imageUrl: string;
}

const ImageWithReactions: FC<ImageWithReactionsProps> = ({ itemId, userId, imageUrl }) => {
  const { data: reactions, isLoading } = useQuery({
    queryKey: ["reactions", itemId],
    queryFn: () => getReactions(itemId, userId),
  });

  if (isLoading) return <Loader />;
  if (!reactions) return <EmptyState message="No reactions yet." />;

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
};

export default memo(ImageWithReactions);

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
});