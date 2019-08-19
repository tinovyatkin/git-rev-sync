'use strict';

const { execFileSync } = require('child_process');

const findUp = require('find-up');
const envCi = require('env-ci');

const { commit: CI_COMMIT } = envCi();

let shortHash;

/**
 * Attempts to get git rev from source-context.json file from Google Cloud Debugging
 * https://cloud.google.com/debugger/docs/setup/nodejs
 *
 * @returns {string | undefined}
 */
function getRevFromSourceContextFile() {
  try {
    const sourceContext = findUp.sync('source-context.json');
    const {
      git: { revisionId },
    } = require(sourceContext);
    return revisionId;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Returns short version of SHA1 of current Git commit
 *
 * @returns {string}
 */
function short() {
  if (shortHash) return shortHash;

  shortHash = (
    CI_COMMIT ||
    process.env.HEROKU_SLUG_COMMIT ||
    getRevFromSourceContextFile() ||
    process.env.GAE_VERSION ||
    execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
      cwd: __dirname,
      encoding: 'utf8',
      timeout: 7000,
    }).replace(/[^\da-z]*/gim, '')
  ).substr(0, 7);

  return shortHash;
}
module.exports.short = short;
