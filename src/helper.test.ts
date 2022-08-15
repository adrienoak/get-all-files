import { describe, expect, it } from "vitest";
import { makeBasePath } from "./helper";
import { sep } from "node:path";

describe("makeBasePath", () => {
  it("checks if it ends in seperator", () => {
    const base = `hello${sep}`;

    const path = makeBasePath(base);

    expect(path).toBe(base + "**");
  });

  it("works if it doesnt end in seperator", () => {
    const base = "hello";

    const path = makeBasePath(base);

    expect(path).toBe(base + sep + "**");
  });
});
