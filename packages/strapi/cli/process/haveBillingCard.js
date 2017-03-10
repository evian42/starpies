'use strict';

/**
 * Module dependencies
 */

// Public dependencies.
const _ = require('lodash');

// Strapi services actions.
const getCardAction = require('../actions/getCard');

// Logger.
const error = require('../utils/output/error');
const wait = require('../utils/output/wait');

module.exports = async (token) => {
  const loader = wait('Check your credit card...');

  const res = await getCardAction(token);

  loader();

  if (res.error) {
    error(res.error);
    process.exit(1);
  }

  return !_.isEmpty(res.card);
};
