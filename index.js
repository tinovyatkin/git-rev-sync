'use strict';

const path = require('path');
const { execFileSync } = require('child_process');
const { existsSync, statSync } = require('fs');

const {
  SOURCE_VERSION,
  HEROKU_SLUG_COMMIT,
  TRAVIS_COMMIT,
  CIRCLE_SHA1,
  GAE_VERSION,
  APPVEYOR_PULL_REQUEST_HEAD_COMMIT,
  APPVEYOR_REPO_COMMIT,
  SHORT_SHA,
} = process.env;

/**
 * Uses following env variables:
 * Heroku: https://devcenter.heroku.com/changelog-items/630
 *         https://devcenter.heroku.com/articles/dyno-metadata
 * Travis: https://docs.travis-ci.com/user/environment-variables/
 * CircleCI: https://circleci.com/docs/1.0/environment-variables/
 * AppVeyor: https://www.appveyor.com/docs/environment-variables/
 * Google Cloud Build: https://cloud.google.com/cloud-build/docs/api/reference/rest/v1/projects.builds#Build
 */

let shortHash;

function searchFileSync(dirToStart, fileToSearch) {
  try {
    let curDir = dirToStart;
    let deep = 0;
    do {
      // console.log(curDir);
      const filePath = path.join(curDir, fileToSearch);
      if (existsSync(filePath)) return filePath;
      curDir = path.resolve(curDir, '..');
    } while (curDir.length > 1 && statSync(curDir).isDirectory() && ++deep < 6);
  } catch (err) {
    // console.error(e);
  }
  return undefined;
}

/**
 * Attempts to get git rev from source-context.json file from Google Cloud Debugging
 * https://cloud.google.com/debugger/docs/setup/nodejs
 *
 * @returns {string}
 */
function getRevFromSourceContextFile() {
  const sourceContext = searchFileSync(__dirname, 'source-context.json');
  if (!sourceContext) return undefined;
  try {
    const {
      git: { revisionId },
    } = require(sourceContext);
    return revisionId;
  } catch (err) {
    console.error(err);
  }
  return undefined;
}

/**
 * Returns short version of SHA1 of current Git commit
 *
 * @returns {string}
 */
function short() {
  if (shortHash) return shortHash;

  shortHash = (
    SOURCE_VERSION ||
    HEROKU_SLUG_COMMIT ||
    TRAVIS_COMMIT ||
    CIRCLE_SHA1 ||
    APPVEYOR_PULL_REQUEST_HEAD_COMMIT ||
    APPVEYOR_REPO_COMMIT ||
    SHORT_SHA ||
    getRevFromSourceContextFile() ||
    GAE_VERSION ||
    execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
      cwd: __dirname,
      encoding: 'utf8',
      timeout: 4000,
    }).replace(/[^\da-z]*/gim, '')
  ).substr(0, 7);

  return shortHash;
}
module.exports.short = short;
