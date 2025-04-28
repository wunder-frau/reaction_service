import { SafeAreaView } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { ImageGrid } from "./components/ImageGrid";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageGrid />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
