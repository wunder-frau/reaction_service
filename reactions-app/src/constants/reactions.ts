import { components, operations } from "../types/api";

export type ReactionType =
  operations["ReactionsController_addReaction"]["parameters"]["path"]["reactionType"];

export type ReactionResponse = components["schemas"]["ReactionResponseDto"];

export const REACTIONS: ReactionType[] = ["LOVE", "FIRE", "ADMIRE", "CLAP"];

export const REACTION_EMOJIS: Record<ReactionType, string> = {
  LOVE: "❤️",
  FIRE: "🔥",
  ADMIRE: "✨",
  CLAP: "👏",
};
