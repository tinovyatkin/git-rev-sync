'use strict';

const { execFileSync } = require('child_process');

const {
  SOURCE_VERSION,
  HEROKU_SLUG_COMMIT,
  TRAVIS_COMMIT,
  CIRCLE_SHA1,
} = process.env;

/**
 * Uses following env variables:
 * Heroku: https://devcenter.heroku.com/changelog-items/630
 *         https://devcenter.heroku.com/articles/dyno-metadata
 * Travis: https://docs.travis-ci.com/user/environment-variables/
 * CircleCI: https://circleci.com/docs/1.0/environment-variables/
 */

let shortHash;

/**
 * Returns short version of SHA1 of current Git commit
 * 
 * @returns {string}
 */
function short() {
  if (shortHash) return shortHash;

  shortHash = (SOURCE_VERSION ||
    HEROKU_SLUG_COMMIT ||
    TRAVIS_COMMIT ||
    CIRCLE_SHA1 ||
    execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
      cwd: __dirname,
      encoding: 'utf8',
      timeout: 4000,
    }).replace(/[^0-9a-z]*/gim, '')
  ).substr(0, 7);

  return shortHash;
}
exports.short = short;
