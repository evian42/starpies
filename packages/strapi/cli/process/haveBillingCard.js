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

module.exports = async (token) => {
  const url = 'http://localhost:1331';

  const res = await getCardAction(url, token);

  if (res.error) {
    error(res.error);
    process.exit(1);
  }

  return !_.isEmpty(res.card);
};
