import { describe, expect, it } from "vitest";
import { conversationTurns, previousPartnerTurn, roleTurnIds } from "../src/data/conversations";

// Main textbook p.57, visually transcribed independently of supplement annotations.
const targets = [
  "Oh my gosh, that guy is so annoying. He’s being so rude to the staff. Look.",
  "Ugh, I hate that. I can’t stand it when people treat others like that.",
  "I know. Especially in public. I feel bad for her.",
  "Speaking of pet peeves, I met up with an old friend yesterday and she was an hour late. She just brushed it off like it was nothing. I was so frustrated.",
  "Oh, I hate that!",
  "If someone is late from time to time, that’s fine. But some people are late every time like it’s not a big deal.",
  "Yeah, that’s frustrating. For me, I get really annoyed when people bump into me while they’re on their phones. I don’t understand how people can be so unaware.",
];

describe("Real Conversations source lock", () => {
  it("keeps exactly seven ordered source turns with correct speakers", () => {
    expect(conversationTurns.map((turn) => turn.english.join(" "))).toEqual(targets);
    expect(conversationTurns.map((turn) => turn.role)).toEqual(["A", "B", "A", "B", "A", "B", "A"]);
    expect(roleTurnIds("A")).toEqual([1, 3, 5, 7]);
    expect(roleTurnIds("B")).toEqual([2, 4, 6]);
  });
  it("does not invent a partner cue before A opens the conversation", () => {
    expect(previousPartnerTurn(1)).toBeUndefined();
    for (const turn of conversationTurns.slice(1)) {
      const partner = previousPartnerTurn(turn.id)!;
      expect(partner.id).toBe(turn.id - 1);
      expect(partner.role).not.toBe(turn.role);
    }
  });
  it("uses only original prefixes and word masks, never generated hints", () => {
    for (const turn of conversationTurns) {
      expect(turn.hint1).toHaveLength(turn.english.length);
      expect(turn.hint2).toHaveLength(turn.english.length);
      turn.english.forEach((line, i) => {
        expect(line.startsWith(turn.hint1[i].replace(/…$/, ""))).toBe(true);
        const expression = turn.hint2[i].split("______").map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("[A-Za-z’]+");
        expect(line).toMatch(new RegExp(`^${expression}$`));
        expect(turn.hint2[i]).toContain("______");
      });
      expect(turn.source.file).toBe("eBook_Bookcamp_Oct8.pdf");
      expect(turn.source.koreanPage).toBe(56);
      expect(turn.source.englishPage).toBe(57);
    }
  });
});
