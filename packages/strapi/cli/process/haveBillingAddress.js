'use strict';

/**
 * Module dependencies
 */

// Strapi services actions.
const userInfosAction = require('../actions/userInfos');

// Logger.
const error = require('../utils/output/error');

module.exports = async (token) => {
  const url = 'http://localhost:1331';

  const res = await userInfosAction(url, token);

  if (res.error) {
    error(res.error);
    process.exit(1);
  }

  return !(!res.customer.billing_address || !res.customer.billing_address.first_name || !res.customer.billing_address.last_name
  || !res.customer.billing_address.line1 || !res.customer.billing_address.city
  || !res.customer.billing_address.country || !res.customer.billing_address.zip);
};
