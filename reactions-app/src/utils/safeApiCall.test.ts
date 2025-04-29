import { safeApiCall } from "./safeApiCall";

import { Alert } from "react-native";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

describe("safeApiCall", () => {
  it("returns result when successful", async () => {
    const mockApi = jest.fn().mockResolvedValue("ok");
    const result = await safeApiCall(mockApi);
    expect(result).toBe("ok");
  });

  it("shows alert and throws on failure", async () => {
    const mockApi = jest.fn().mockRejectedValue(new Error("fail"));
    await expect(safeApiCall(mockApi)).rejects.toThrow("fail");
    expect(Alert.alert).toHaveBeenCalledWith(
      "Oops",
      "Something went wrong. Please try again."
    );
  });
});
