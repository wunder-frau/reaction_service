import { operations, components } from "../types/api";
import axios from "axios";
type ReactionType =
  operations["ReactionsController_addReaction"]["parameters"]["path"]["reactionType"];
type ReactionResponse = components["schemas"]["ReactionResponseDto"];

const BASE_URL = "http://192.168.1.152:3000"; // Replace with your local IP if on real device

// Get reactions for an item
export const getReactions = async (
  itemId: string,
  userId?: string
): Promise<ReactionResponse> => {
  const response = await axios.get(`${BASE_URL}/reactions/${itemId}`, {
    headers: userId ? { userId } : undefined,
  });
  return response.data;
};

// Add a reaction
export const addReaction = async (
  itemId: string,
  reactionType: ReactionType,
  userId: string
): Promise<ReactionResponse> => {
  const response = await axios.post(
    `${BASE_URL}/reactions/${itemId}/${reactionType}`,
    {},
    { headers: { userId } }
  );
  return response.data;
};

// Remove a reaction
export const removeReaction = async (
  itemId: string,
  reactionType: ReactionType,
  userId: string
): Promise<ReactionResponse> => {
  const response = await axios.delete(
    `${BASE_URL}/reactions/${itemId}/${reactionType}`,
    { headers: { userId } }
  );
  return response.data;
};
