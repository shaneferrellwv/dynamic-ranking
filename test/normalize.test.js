import { expect, test } from 'vitest'
import { normalize } from "../lib/normalize.js"

// ============ linear normalization =================

test('linear normalization of simple data', () => {
  const input = [
    { name: "item0", criteria0: 5,  criteria1: 10, criteria2: 15 },
    { name: "item1", criteria0: 15, criteria1: 1,  criteria2: 5 },
    { name: "item2", criteria0: 20, criteria1: 4,  criteria2: 10 },
    { name: "item3", criteria0: 5,  criteria1: 5,  criteria2: 5 }
  ];
  const expected = [
    { name: "item0", criteria0: 0, criteria1: 1, criteria2: 1 },
    { name: "item1", criteria0: 0.6666666666666666, criteria1: 0, criteria2: 0 },
    { name: "item2", criteria0: 1, criteria1: 0.3333333333333333, criteria2: 0.5 },
    { name: "item3", criteria0: 0, criteria1: 0.4444444444444444, criteria2: 0 }
  ];
  const output = normalize(input, "linear", ["criteria0", "criteria1", "criteria2"]);
  expect(output).toEqual(expected);
});

test('linear normalization with constant values', () => {
  const input = [
    { name: "a", score: 10 },
    { name: "b", score: 10 },
    { name: "c", score: 10 }
  ];
  const expected = [
    { name: "a", score: 0 },
    { name: "b", score: 0 },
    { name: "c", score: 0 }
  ];
  const output = normalize(input, "linear", ["score"]);
  expect(output).toEqual(expected);
});

test('linear normalization with negative values', () => {
  const input = [
    { name: "a", score: -10 },
    { name: "b", score: 0 },
    { name: "c", score: 10 }
  ];
  const expected = [
    { name: "a", score: 0 },
    { name: "b", score: 0.5 },
    { name: "c", score: 1 }
  ];
  const output = normalize(input, "linear", ["score"]);
  expect(output).toEqual(expected);
});

test('linear normalization with multiple columns', () => {
  const input = [
    { name: "a", a: 1, b: 10 },
    { name: "b", a: 3, b: 30 },
    { name: "c", a: 2, b: 20 }
  ];
  const expected = [
    { name: "a", a: 0,   b: 0 },
    { name: "b", a: 1,   b: 1 },
    { name: "c", a: 0.5, b: 0.5 }
  ];
  const output = normalize(input, "linear", ["a", "b"]);
  expect(output).toEqual(expected);
});

test('linear normalization with single element', () => {
  const input = [{ name: "only", score: 42 }];
  const expected = [{ name: "only", score: 0 }];
  const output = normalize(input, "linear", ["score"]);
  expect(output).toEqual(expected);
});

test('linear normalization does not affect non-specified columns', () => {
  const input = [
    { name: "a", score: 1, weight: 100 },
    { name: "b", score: 3, weight: 150 },
    { name: "c", score: 2, weight: 200 }
  ];
  const expected = [
    { name: "a", score: 0, weight: 100 },
    { name: "b", score: 1, weight: 150 },
    { name: "c", score: 0.5, weight: 200 }
  ];
  const output = normalize(input, "linear", ["score"]);
  expect(output).toEqual(expected);
});

test('linear normalization with empty array', () => {
  const input = [];
  const expected = [];
  const output = normalize(input, "linear", ["score"]);
  expect(output).toEqual(expected);
});

// ============ logarthmic normalization =================

test('log normalization of simple data', () => {
  const input = [
    { name: "item0", criteria0: 1 },
    { name: "item1", criteria0: 10 },
    { name: "item2", criteria0: 100 },
    { name: "item3", criteria0: 1000 },
    { name: "item4", criteria0: 10000 }
  ];
  const expected = [
    { name: "item0", criteria0: 0 },
    { name: "item1", criteria0: 2.302585092994046 },
    { name: "item2", criteria0: 4.605170185988092 },
    { name: "item3", criteria0: 6.907755278982137 },
    { name: "item4", criteria0: 9.210340371976184 }
  ];
  const output = normalize(input, "log", ["criteria0"]);
  expect(output).toEqual(expected);
});

test('log normalization with constant values', () => {
  const input = [
    { name: "a", score: 10 },
    { name: "b", score: 10 },
    { name: "c", score: 10 }
  ];
  const expected = [
    { name: "a", score: 0 },
    { name: "b", score: 0 },
    { name: "c", score: 0 }
  ];
  const output = normalize(input, "log", ["score"]);
  expect(output).toEqual(expected);
});