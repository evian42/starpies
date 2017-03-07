'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const fs = require('fs');
const path = require('path');

// Strapi services actions.
const getApplicationAction = require('../actions/getApplication');

module.exports = async (token) => {
  try {
    const strapirc = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '.strapirc'), 'utf8'));

    const res = await getApplicationAction(token, strapirc.name);

    return (!res.error) ? res : res.error;
  } catch(e) {
    return 'not_deploy';
  }
};
