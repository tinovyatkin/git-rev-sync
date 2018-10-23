"use strict";

const gitHash = require("./");

test("short", () => {
  console.log(process.env);
  const short = gitHash.short();
  expect(short).toHaveLength(7);
  expect(short).toMatch(/^[\da-z]{7}$/);
});
