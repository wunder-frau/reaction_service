import { operations, components } from "../types/api";
import { safeApiCall } from "@/utils/safeApiCall";
import axios from "axios";

type ReactionType =
  operations["ReactionsController_addReaction"]["parameters"]["path"]["reactionType"];
type ReactionResponse = components["schemas"]["ReactionResponseDto"];

const api = axios.create({
  baseURL: "http://192.168.1.152:3000",
});

export const getReactions = async (
  itemId: string,
  userId?: string
): Promise<ReactionResponse> => {
  return safeApiCall(async () => {
    const response = await api.get(`/reactions/${itemId}`, {
      headers: userId ? { userId } : undefined,
    });
    return response.data;
  });
};

export const addReaction = async (
  itemId: string,
  reactionType: ReactionType,
  userId: string
): Promise<ReactionResponse> => {
  return safeApiCall(async () => {
    const response = await api.post(
      `/reactions/${itemId}/${reactionType}`,
      {},
      { headers: { userId } }
    );
    return response.data;
  });
};

export const removeReaction = async (
  itemId: string,
  reactionType: ReactionType,
  userId: string
): Promise<ReactionResponse> => {
  return safeApiCall(async () => {
    const response = await api.delete(
      `/reactions/${itemId}/${reactionType}`,
      { headers: { userId } }
    );
    return response.data;
  });
};
