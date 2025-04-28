import React from "react";
import { View, FlatList, Image, Dimensions, StyleSheet } from "react-native";

const images = [
  "https://assets.misspompadour.xyz/mce-dev/media-library/5f02af76-42e3-4acc-9463-1aa2c95579f6.png",
  "https://assets.misspompadour.xyz/mce-dev/media-library/db5f0c5f-d2d8-420e-94d7-726fe5d3cee2.png",
  "https://assets.misspompadour.xyz/mce-dev/media-library/f09013b9-4244-4c5c-b388-73b369c1da6a.png",
];

const screenWidth = Dimensions.get("window").width;

export const ImageGrid = () => {
  return (
    <FlatList
      data={images}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item }}
            style={styles.image}
            resizeMode="cover"
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
  image: {
    width: screenWidth * 0.9,
    height: screenWidth * 0.9,
    borderRadius: 12,
  },
});
