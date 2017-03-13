'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const fs = require('fs');
const path = require('path');

// Strapi services actions.
const userInfosAction = require('../actions/userInfos');

// Loggers.
const wait = require('../utils/output/wait');

module.exports = async () => {
  try {
    const HOME = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
    const strapirc = JSON.parse(fs.readFileSync(path.resolve(HOME, '.strapirc'), 'utf8'));

    const loader = wait('Check if you are login to your Strapi account...');

    const res = await userInfosAction(strapirc.token);

    loader();

    return (!res.error) ? strapirc : 'expire';
  } catch(e) {
    return 'not_login';
  }
};
