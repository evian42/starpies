'use strict';

/**
 * Module dependencies
 */

// Strapi services actions.
const deploySigninAction = require('../actions/deploySignin');

// Loggers.
const wait = require('../utils/output/wait');

module.exports = async (token) => {
  const loader = wait('Check your deploy account...');

  const res = await deploySigninAction(token);

  loader();

  if (!res.error) {
    return true;
  } else {
    return false;
  }
};
