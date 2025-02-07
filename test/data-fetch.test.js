import { expect, test } from 'vitest'
import { fetchDataPromise } from "../lib/data-fetch.js"

test('fetch data file', async () => {
  const expectedData = [
    { "name": "item0", "criteria0": 5,  "criteria1": 10, "criteria2": 15 },
    { "name": "item1", "criteria0": 15, "criteria1": 1,  "criteria2": 5 },
    { "name": "item2", "criteria0": 20, "criteria1": 4,  "criteria2": 10 },
    { "name": "item3", "criteria0": 5,  "criteria1": 5,  "criteria2": 5 }
];
  const output = await fetchDataPromise("JSON", "./data.json");
  expect(output).toEqual(expectedData);
});

test('fetch empty file', async () => {
  await expect(fetchDataPromise("JSON", "./empty.json"))
    .rejects
    .toThrowError();
});
