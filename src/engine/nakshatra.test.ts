import { getNakshatraInfo } from "./nakshatra";

describe("getNakshatraInfo", () => {
  it("returns Ashwini for index 0", () => {
    const result = getNakshatraInfo(0, 0, null);
    expect(result.name.en).toBe("Ashwini");
    expect(result.name.te).toBe("అశ్వని");
    expect(result.number).toBe(1);
    expect(result.pada).toBe(1);
  });

  it("returns Revati for index 26", () => {
    const result = getNakshatraInfo(26, 3, null);
    expect(result.name.en).toBe("Revati");
    expect(result.name.te).toBe("రేవతి");
    expect(result.number).toBe(27);
    expect(result.pada).toBe(4);
  });

  it("converts 0-indexed pada to 1-indexed", () => {
    expect(getNakshatraInfo(5, 0, null).pada).toBe(1);
    expect(getNakshatraInfo(5, 1, null).pada).toBe(2);
    expect(getNakshatraInfo(5, 2, null).pada).toBe(3);
    expect(getNakshatraInfo(5, 3, null).pada).toBe(4);
  });

  it("throws for invalid index", () => {
    expect(() => getNakshatraInfo(27, 0, null)).toThrow(
      "Invalid nakshatra index"
    );
  });
});
