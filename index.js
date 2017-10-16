'use strict';

const { execFileSync } = require('child_process');

function short() {
  // git rev-parse --short HEAD
  const res = execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
    cwd: __dirname,
    encoding: 'utf8',
    timeout: 4000,
  });

  // we should trim everything less numbers and letters
  return res.replace(/[^0-9a-z]*/gim, '');
}
exports.short = short;
