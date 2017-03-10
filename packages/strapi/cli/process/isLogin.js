'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const fs = require('fs');
const path = require('path');

// Strapi services actions.
const userInfosAction = require('../actions/userInfos');

module.exports = async () => {
  try {
    const HOME = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
    const strapirc = JSON.parse(fs.readFileSync(path.resolve(HOME, '.strapirc'), 'utf8'));

    const res = await userInfosAction(strapirc.token);

    return (!res.error) ? strapirc : 'expire';
  } catch(e) {
    return 'not_login';
  }
};
