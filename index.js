'use strict';

const { execFileSync } = require('child_process');

let shortHash;

function short() {
  if (shortHash) return shortHash;

  // Heroku Build stage special env variable that is short hash - https://devcenter.heroku.com/changelog-items/630
  if ('SOURCE_VERSION' in process.env) {
    shortHash = process.env.SOURCE_VERSION;
  } else if ('HEROKU_SLUG_COMMIT' in process.env) {
    // labs metadata https://devcenter.heroku.com/articles/dyno-metadata
    shortHash = process.env.HEROKU_SLUG_COMMIT.slice(0, 7);
  } else if ('TRAVIS_COMMIT' in process.env) {
    // https://docs.travis-ci.com/user/environment-variables/
    shortHash = process.env.TRAVIS_COMMIT;
  } else {
    // git rev-parse --short HEAD
    const res = execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
      cwd: __dirname,
      encoding: 'utf8',
      timeout: 4000,
    });

    // we should trim everything less numbers and letters
    shortHash = res.replace(/[^0-9a-z]*/gim, '');
  }
  return shortHash;
}
exports.short = short;
