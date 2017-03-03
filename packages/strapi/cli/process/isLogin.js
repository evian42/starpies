'use strict';

/**
 * Module dependencies
 */

// Node.js core
const fs = require('fs');
const path = require('path');

// Strapi services actions.
const userInfosAction = require('../actions/userInfos');

module.exports = async () => {
  const url = 'http://localhost:1331';

  try {
    const HOME = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
    const strapirc = JSON.parse(fs.readFileSync(path.resolve(HOME, '.strapirc'), 'utf8'));

    const res = await userInfosAction(url, strapirc.token);

    if (!res.error) {
      return strapirc;
    } else {
      return 'expire';
    }
  } catch(e) {
    return 'not_login';
  }
};
