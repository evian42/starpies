'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const fs = require('fs');
const path = require('path');

// Utils.
const cmd = require('../utils/cmd');

module.exports = async () => {
  try {
    const strapirc = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '.strapirc'), 'utf8'));

    await cmd(`open ${strapirc.url}`);
  } catch(e) {
    return 'not_deploy';
  }
};
