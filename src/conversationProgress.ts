import { conversationTurns, roleTurnIds, type ConversationRole } from "./data/conversations";
import type { Rating, ReadMode } from "./progress";

export type ConversationProgress = {
  view: "read" | "role" | "role-summary" | "full";
  readMode: ReadMode;
  role: ConversationRole;
  positions: Record<ConversationRole, number>;
  ratings: Record<number, Rating | null>;
  hintUsage: Record<number, 0 | 1 | 2>;
  fullRecallCompleted: boolean;
};
export type ConversationAction =
  | { type: "view"; view: "read" | "full" }
  | { type: "readMode"; mode: ReadMode }
  | { type: "role"; role: ConversationRole; restart?: boolean }
  | { type: "hint"; level: 1 | 2 }
  | { type: "rate"; rating: Rating }
  | { type: "previous" }
  | { type: "complete" };

export function initialConversationProgress(): ConversationProgress {
  return {
    view: "read", readMode: "korean", role: "A", positions: { A: 0, B: 0 },
    ratings: Object.fromEntries(conversationTurns.map(({ id }) => [id, null])),
    hintUsage: Object.fromEntries(conversationTurns.map(({ id }) => [id, 0])),
    fullRecallCompleted: false,
  };
}
export const isRoleComplete = (p: ConversationProgress, role: ConversationRole) =>
  roleTurnIds(role).every((id) => p.ratings[id] != null);
export const isConversationComplete = (p: ConversationProgress) =>
  isRoleComplete(p, "A") && isRoleComplete(p, "B") && p.fullRecallCompleted;

export function updateConversationProgress(p: ConversationProgress, action: ConversationAction): ConversationProgress {
  const ids = roleTurnIds(p.role);
  const position = p.positions[p.role];
  const id = ids[position];
  switch (action.type) {
    case "view": return { ...p, view: action.view };
    case "readMode": return { ...p, readMode: action.mode };
    case "role": return {
      ...p, view: "role", role: action.role,
      positions: { ...p.positions, [action.role]: action.restart ? 0 : p.positions[action.role] },
    };
    case "hint": return p.view !== "role" ? p : {
      ...p, hintUsage: { ...p.hintUsage, [id]: Math.max(p.hintUsage[id], action.level) as 1 | 2 },
    };
    case "rate": return p.view !== "role" ? p : {
      ...p, ratings: { ...p.ratings, [id]: action.rating },
      positions: { ...p.positions, [p.role]: Math.min(position + 1, ids.length - 1) },
      view: position === ids.length - 1 ? "role-summary" : "role",
    };
    case "previous": return p.view !== "role" ? p : {
      ...p, positions: { ...p.positions, [p.role]: Math.max(0, position - 1) },
    };
    case "complete": return p.view !== "full" ? p : { ...p, fullRecallCompleted: true };
  }
}

const record = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
export function parseConversationProgress(value: unknown): ConversationProgress | null {
  if (!record(value) || !["read", "role", "role-summary", "full"].includes(value.view as string)
    || !["korean", "english", "together"].includes(value.readMode as string)
    || (value.role !== "A" && value.role !== "B")
    || !record(value.positions) || !record(value.ratings) || !record(value.hintUsage)
    || typeof value.fullRecallCompleted !== "boolean") return null;
  const { positions, ratings, hintUsage } = value;
  if (!( ["A", "B"] as const).every((role) => typeof positions[role] === "number"
    && Number.isInteger(positions[role]) && positions[role] >= 0 && positions[role] < roleTurnIds(role).length)
    || !conversationTurns.every(({ id }) => [null, "immediate", "effort", "review"].includes(ratings[id] as Rating | null)
      && [0, 1, 2].includes(hintUsage[id] as number))) return null;
  const result: ConversationProgress = {
    view: value.view as ConversationProgress["view"], readMode: value.readMode as ReadMode,
    role: value.role, positions: { A: positions.A as number, B: positions.B as number },
    ratings: Object.fromEntries(conversationTurns.map(({ id }) => [id, ratings[id] as Rating | null])),
    hintUsage: Object.fromEntries(conversationTurns.map(({ id }) => [id, hintUsage[id] as 0 | 1 | 2])),
    fullRecallCompleted: value.fullRecallCompleted,
  };
  // A summary cannot legitimately precede the final rated turn.
  if (result.view === "role-summary" && (!isRoleComplete(result, result.role)
    || result.positions[result.role] !== roleTurnIds(result.role).length - 1)) result.view = "role";
  return result;
}
