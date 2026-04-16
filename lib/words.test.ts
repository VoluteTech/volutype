import { commonWords, generateWords } from "./words";

describe("words generation", () => {
  it("should return array with the correct length", () => {
    const res = generateWords(40);
    expect(res).toHaveLength(40);
  });

  it("should return a word from commonWords only", () => {
    const res = generateWords(10);
    res.forEach((word) => {
      expect(res).toContain(word);
    });
  });

  it("should return a different result on multiple calls", () => {
    const res1 = generateWords(10);
    const res2 = generateWords(10);
    expect(res1).not.toEqual(res2);
  });
});
