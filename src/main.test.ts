import { afterEach, beforeEach, describe, expect, it } from "vitest";
import mockFS from "mock-fs";
import { getAllFiles, getAllFilesSync } from "./main";
import { type DirectoryItems } from "mock-fs/lib/filesystem";

function loopThroughMock(object: DirectoryItems = {}, dot = false): number {
  return Object.entries(object).reduce((acc, [key, value]) => {
    if (key[0] === "." && !dot) {
      return acc;
    }
    if (typeof value === "string") {
      return acc + 1;
    }

    if (value instanceof Object) {
      return acc + loopThroughMock(value as DirectoryItems, dot);
    }

    return acc;
  }, 0);
}

describe("loop helper", () => {
  it("calculates only values", () => {
    expect(loopThroughMock({})).toBe(0);
    expect(loopThroughMock({ value: "here" })).toBe(1);
    expect(loopThroughMock({ value: { value: "here" } })).toBe(1);
    expect(loopThroughMock({ value: { value1: "here", value2: "here" } })).toBe(
      2
    );
    expect(
      loopThroughMock({ value: { value1: "here", value2: "here" }, foo: "bar" })
    ).toBe(3);

    expect(loopThroughMock({ ".git": "val" })).toBe(0);
    expect(loopThroughMock({ ".git": "val" }, true)).toBe(1);
  });
});

const mock: DirectoryItems = {
  [`${process.cwd()}`]: {
    testing: {
      voila: {
        yo: {
          foo: {
            bar: "baz",
            val: "random",
          },
        },
      },
    },
    ".git": {
      HEAD: "true",
    },
  },
};

describe("async ", () => {
  beforeEach(() => {
    mockFS(mock, { createCwd: false });
  });

  afterEach(() => {
    mockFS.restore();
  });

  it("works?", async () => {
    const data = await getAllFiles();

    expect(data).toHaveLength(loopThroughMock(mock));
  });

  it("works with dot", async () => {
    mockFS(mock, {
      createCwd: false,
    });
    const withoutDot = loopThroughMock(mock);
    const withDot = loopThroughMock(mock, true);
    const data = await getAllFiles({ dot: true });

    expect(withDot).toBeGreaterThan(withoutDot);
    expect(data).toHaveLength(withDot);
  });
});

describe("sync ", () => {
  beforeEach(() => {
    mockFS(mock, { createCwd: false });
  });

  afterEach(() => {
    mockFS.restore();
  });

  it("works?", () => {
    const data = getAllFilesSync();

    expect(data).toHaveLength(loopThroughMock(mock));
  });

  it("works with dot", () => {
    mockFS(mock, {
      createCwd: false,
    });
    const withoutDot = loopThroughMock(mock);
    const withDot = loopThroughMock(mock, true);
    const data = getAllFilesSync({ dot: true });

    expect(withDot).toBeGreaterThan(withoutDot);
    expect(data).toHaveLength(withDot);
  });
});
