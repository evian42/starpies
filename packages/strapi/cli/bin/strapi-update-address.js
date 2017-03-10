#!/usr/bin/env node

'use strict';

/**
 * Module dependencies
 */

// Public dependencies.
const _ = require('lodash');

// Strapi services actions.
const userInfosAction = require('../actions/userInfos');

// Processes.
const isLoginProcess = require('../process/isLogin');
const loginProcess = require('../process/login');
const updateAddressProcess = require('../process/updateAddress');

// Utils.
const countries = require('../utils/billing/country-list');

// Logger.
const info = require('../utils/output/info');
const wait = require('../utils/output/wait');

/**
 * `$ strapi update:address`
 *
 * Update billing address
 */

module.exports = async () => {
  const isLogin = await isLoginProcess();
  let auth;

  if (typeof isLogin === 'object') {
    auth = isLogin;
  } else {
    info('You need Strapi account to access to this feature');

    auth = await loginProcess();
  }

  const loader = wait('Load your account data...');

  const res = await userInfosAction(auth.token);

  loader();

  _.mapKeys(countries, function(value, key) {
    if (value === res.customer.billing_address.country) res.customer.billing_address.country = key;
  });

  await updateAddressProcess(auth.token, {
    address: {
      firstName: res.customer.billing_address.first_name,
      lastName: res.customer.billing_address.last_name,
      country: res.customer.billing_address.country,
      zipCode: res.customer.billing_address.zip,
      city: res.customer.billing_address.city,
      address1: res.customer.billing_address.line1
    },
    company: {
      name: res.customer.billing_address.company,
      vat: res.customer.vat_number
    }
  });

  process.exit(1);
};
