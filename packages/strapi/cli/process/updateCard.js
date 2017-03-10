'use strict';

/**
 * Module dependencies
 */

// Public dependencies.
const _ = require('lodash');

// Credit card form.
const ccForm = require('../forms/cc');

// Strapi services actions.
const updateAction = require('../actions/updateCard');

// Utils.
const countries = require('../utils/billing/country-list');

// Logger.
const error = require('../utils/output/error');
const success = require('../utils/output/success');
const wait = require('../utils/output/wait');

module.exports = async (token) => {
  const card = await ccForm();

  const loader = wait('Link this credit card to your account...');

  const res = await updateAction(token, {
    number: card.cardNumber,
    month: _.trim(card.expDate.split('/')[0]),
    year:  _.trim(card.expDate.split('/')[1]),
    cvv: card.ccv,
    country: countries[card.country]
  });

  loader();

  if (res.error) {
    error(res.error);
    process.exit(1);
  }

  success('This credit card have been linked to your account');

  return card;
};
