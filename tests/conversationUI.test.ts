import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ConversationScreen } from "../src/ConversationScreen";
import { initialConversationProgress } from "../src/conversationProgress";
import type { ConversationProgress } from "../src/conversationProgress";
import { conversationTurns, roleTurnIds } from "../src/data/conversations";

const render = (p: ConversationProgress) => renderToStaticMarkup(createElement(ConversationScreen, { progress: p, dispatch: () => {}, onOverview: () => {} }));

describe("Conversation screen safety and learning flow", () => {
  it("shows source Korean by default, without voice practice in Read", () => {
    const html = render(initialConversationProgress());
    expect(html).toContain("7 turns");
    expect(html).not.toContain("voice-practice");
    for (const turn of conversationTurns) expect(html).toContain(turn.korean);
    expect(html).not.toContain("Oh my gosh");
  });
  it("offers both source languages in Read", () => {
    const html = render({ ...initialConversationProgress(), readMode: "together" });
    expect(html).toContain("Oh my gosh");
    expect(html).toContain(conversationTurns[0].korean);
    expect(html).toContain("dialogue-bilingual");
  });
  it.each(conversationTurns)("does not leak my English on entering turn $id", (turn) => {
    const p = initialConversationProgress();
    p.view = "role";
    p.role = turn.role;
    p.positions[turn.role] = roleTurnIds(turn.role).indexOf(turn.id);
    const html = render(p);
    expect(html).toContain(turn.korean);
    expect(html).not.toContain(turn.english.join(" "));
    expect(html).toContain("Show answer");
    expect(html).not.toContain("rating-buttons");
    expect(html).toContain("voice-practice");
    if (turn.id === 1) expect(html).toContain("You start the conversation.");
    else expect(html).toContain(conversationTurns[turn.id - 2].english.join(" "));
  });
  it("Full Dialogue starts Korean-only and does not imply all roles are complete", () => {
    const html = render({ ...initialConversationProgress(), view: "full", fullRecallCompleted: true });
    expect(html).not.toContain("Oh my gosh");
    expect(html).toContain("Your progress");
    expect(html).not.toContain("Real Conversations complete");
    expect(html).toContain("0 / 4 rated");
    expect(html).toContain("0 / 3 rated");
  });
  it("only labels this section complete, not Chapter or Pass", () => {
    const html = render({ ...initialConversationProgress(), view: "full", fullRecallCompleted: true, ratings: Object.fromEntries(conversationTurns.map((turn) => [turn.id, "review"])) });
    expect(html).toContain("Real Conversations complete");
    expect(html).not.toContain("Pass 1 complete");
  });
});
