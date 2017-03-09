'use strict';

/**
 * Module dependencies
 */

// Forms.
const addressForm = require('../forms/address');
const companyForm = require('../forms/company');

// Strapi services actions.
const updateAction = require('../actions/updateAddress');

// Utils.
const countries = require('../utils/billing/country-list');
const listInput = require('../utils/input/list');

// Logger.
const error = require('../utils/output/error');
const success = require('../utils/output/success');

module.exports = async (token, country) => {
  const url = 'http://localhost:1331';

  const address = await addressForm(country);

  const choice = await listInput({
    message: 'Are you a company?',
    choices: [{
      name: 'Yes, I\'m a company',
      value: 'company',
      short: 'Company'
    },
    {
      name: 'No, I\'m not a company',
      value: 'customer',
      short: 'Individual'
    }],
    separator: false,
    abort: 'end'
  });

  if (!choice) {
    process.exit(1);
  }

  if (choice === 'company') {
    const company = await companyForm(countries[address.country]);

    address.company = company.name;
    address.vat = company.vat;
  }

  const res = await updateAction(url, token, {
    first_name: address.firstName,
    last_name: address.lastName,
    company: address.company,
    vat_number: address.vat,
    line1: address.address1,
    city: address.city,
    zip: address.zipCode,
    country: countries[address.country]
  });

  if (res.error) {
    error(res.error);
    process.exit(1);
  }

  success('This billing address have been linked to you account');

  return address;
};
