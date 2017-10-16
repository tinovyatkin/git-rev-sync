'use strict';

const gitHash = require('./');

test('short', () => {
  const short = gitHash.short();
  expect(short).toHaveLength(7);
  expect(short).toMatch(/^[a-z0-9]{7,7}$/);
});
