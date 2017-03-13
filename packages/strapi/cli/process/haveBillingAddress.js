'use strict';

/**
 * Module dependencies
 */

// Strapi services actions.
const userInfosAction = require('../actions/userInfos');

// Loggers.
const error = require('../utils/output/error');
const wait = require('../utils/output/wait');

module.exports = async (token) => {
  const loader = wait('Check your billing adddress...');

  const res = await userInfosAction(token);

  loader();

  if (res.error) {
    error(res.error);
    process.exit(1);
  }

  return !(!res.customer.billing_address || !res.customer.billing_address.first_name || !res.customer.billing_address.last_name
  || !res.customer.billing_address.line1 || !res.customer.billing_address.city
  || !res.customer.billing_address.country || !res.customer.billing_address.zip);
};
