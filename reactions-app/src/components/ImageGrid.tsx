import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import ImageWithReactions from "../components/ImageWithReactions";
import { images } from "../data/images";

export const ImageGrid = () => {
  return (
    <FlatList
      data={images}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.imageContainer}>
          <ImageWithReactions
            itemId={item.id}
            userId="abc123"
            imageUrl={item.url}
          />
        </View>
      )}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 10,
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
});

export default ImageGrid;
