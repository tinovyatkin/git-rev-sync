"use strict";

const gitHash = require("./");

test("short", () => {
  const short = gitHash.short();
  expect(short).toHaveLength(7);
  expect(short).toMatch(/^[\da-z]{7}$/);
});
