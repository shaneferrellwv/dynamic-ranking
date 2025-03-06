import { expect, test } from 'vitest'
import { validate } from "../lib/validate.js"

// Test to check that the validate function does not throw an error
test('should not throw an error when all columns exist in the data', () => {
  const expectedData = [
    { "name": "item0", "criteria0": 5,  "criteria1": 10, "criteria2": 15 },
    { "name": "item1", "criteria0": 15, "criteria1": 1,  "criteria2": 5 },
    { "name": "item2", "criteria0": 20, "criteria1": 4,  "criteria2": 10 },
    { "name": "item3", "criteria0": 5,  "criteria1": 5,  "criteria2": 5 }
  ];
  const columns = ["criteria0", "criteria1", "criteria2"];
  expect(() => validate(expectedData, columns)).not.toThrow();
});

// Test to check that validate throws an error when a required column is missing
test('should throw an error when a column is missing', () => {
  const incompleteData = [
    { "name": "item0", "criteria0": 5, "criteria1": 10 },
    { "name": "item1", "criteria0": 15, "criteria1": 1 },
    { "name": "item2", "criteria0": 20, "criteria1": 4 }
  ];
  const columns = ["criteria0", "criteria1", "criteria2"];
  expect(() => validate(incompleteData, columns)).toThrowError("Column criteria2 is not a property on all data.");
});

// Test incorrect names of columns
test('should throw an error when a names are incorrect', () => {
  const wrongData = [
    { "name": "item0", "criteria0": 5,  "criteria1": 10, "criteria2": 15 },
    { "name": "item1", "criteria0": 15, "criteria1": 1,  "criteria2": 5 },
    { "name": "item2", "criteria0": 20, "criteria2": 4,  "criteria3": 10 },
    { "name": "item3", "criteria0": 5,  "criteria1": 5,  "criteria5": 5 }
  ];
  const columns = ["criteria0", "criteria1", "criteria2"];
  expect(() => validate(wrongData, columns)).toThrowError("Column criteria1 is not a property on all data.");
});