'use strict';

/**
 * Module dependencies
 */

// Strapi services actions.
const deploySigninAction = require('../actions/deploySignin');

module.exports = async (token) => {
  const url = 'http://localhost:1332';

  const res = await deploySigninAction(url, token);

  if (!res.error) {
    return true;
  } else {
    return false;
  }
};
