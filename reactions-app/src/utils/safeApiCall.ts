import { Alert } from "react-native";

export async function safeApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
  try {
    const response = await apiCall();
    return response;
  } catch (error) {
    console.error("API Error:", error);
    Alert.alert("Oops", "Something went wrong. Please try again.");
    throw error;
  }
}
