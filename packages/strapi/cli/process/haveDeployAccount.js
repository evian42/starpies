'use strict';

/**
 * Module dependencies
 */

// Strapi services actions.
const deploySigninAction = require('../actions/deploySignin');

module.exports = async (token) => {
  const res = await deploySigninAction(token);

  if (!res.error) {
    return true;
  } else {
    return false;
  }
};
