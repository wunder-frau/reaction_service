import React from "react";
import { View, FlatList, Dimensions, StyleSheet } from "react-native";
import ImageWithReactions from "../components/ImageWithReactions"; // ✅ use ImageWithReactions instead of direct ReactionBar

const images = [
  {
    id: "796a2ebb-95b4-4a00-927a-f938cf741e81",
    url: "https://assets.misspompadour.xyz/mce-dev/media-library/5f02af76-42e3-4acc-9463-1aa2c95579f6.png",
  },
  {
    id: "db5f0c5f-d2d8-420e-94d7-726fe5d3cee2",
    url: "https://assets.misspompadour.xyz/mce-dev/media-library/db5f0c5f-d2d8-420e-94d7-726fe5d3cee2.png",
  },
  {
    id: "f09013b9-4244-4c5c-b388-73b369c1da6a",
    url: "https://assets.misspompadour.xyz/mce-dev/media-library/f09013b9-4244-4c5c-b388-73b369c1da6a.png",
  },
];

const screenWidth = Dimensions.get("window").width;

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
