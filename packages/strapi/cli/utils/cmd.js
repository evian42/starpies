'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const {exec} = require('child_process');

module.exports = cmd => {
  return new Promise(resolve => {
    exec(cmd, (err, stdout) => {
      return resolve(stdout);
    });
  });
};
