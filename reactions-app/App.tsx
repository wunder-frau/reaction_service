import { SafeAreaView } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ImageGrid from "@/components/ImageGrid"; // ✅ correct import path (notice no "../")

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={{ flex: 1 }}>
        <ImageGrid />
      </SafeAreaView>
    </QueryClientProvider>
  );
}
