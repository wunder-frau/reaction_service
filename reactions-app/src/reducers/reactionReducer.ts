export type ReactionState = Record<string, number>;
export type ReactionAction =
  | { type: "increment"; reaction: string }
  | { type: "decrement"; reaction: string }
  | { type: "sync"; reactions: ReactionState };

export const reactionReducer = (
  state: ReactionState,
  action: ReactionAction
): ReactionState => {
  switch (action.type) {
    case "increment":
      return {
        ...state,
        [action.reaction]: (state[action.reaction] || 0) + 1,
      };
    case "decrement":
      return {
        ...state,
        [action.reaction]: Math.max((state[action.reaction] || 0) - 1, 0),
      };
    case "sync":
      return action.reactions;
    default:
      return state;
  }
};
