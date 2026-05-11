import {
  normalizeBroadcastMessage,
  normalizeHistoryMessage,
} from "./parseWsChatPayload";

describe("parseWsChatPayload", () => {
  describe("normalizeHistoryMessage", () => {
    it("returns null for unsupported message kind", () => {
      const result = normalizeHistoryMessage({
        type: "ping",
        id: "1",
        time: "t",
        user_id: "1",
        content: "",
      });

      expect(result).toBeNull();
    });
    it("normalizes a minimal history row", () => {
      const row = {
        type: "message",
        id: "1",
        time: "2020-01-01T00:00:00.000Z",
        user_id: 42,
        content: "hi",
      };

      expect(normalizeHistoryMessage(row)).toEqual({
        id: "1",
        time: "2020-01-01T00:00:00.000Z",
        userId: "42",
        content: "hi",
        kind: "message",
        file: undefined,
      });
    });
  });
  describe("normalizeBroadcastMessage", () => {
    it("returns null when id is missing", () => {
      const result = normalizeBroadcastMessage({
        type: "message",
        time: "t",
        user_id: "1",
        content: "c",
      });

      expect(result).toBeNull();
    });
  });
});
