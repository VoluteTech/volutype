import { commonWords, generateWords } from './words';

describe("words generation", () => {
  it("should return array with the correct length", () => {
    const res = generateWords(40);
    expect(res).toHaveLength(40);
  })
})
