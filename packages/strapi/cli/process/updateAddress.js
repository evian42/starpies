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
const wait = require('../utils/output/wait');

module.exports = async (token, data) => {
  if (!data) {
    data = {
      address: {},
      company: {}
    };
  }

  const address = await addressForm(data.address);

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
    if (!data.company.country) data.company.country = address.country;
    data.company.country = countries[data.company.country];

    const company = await companyForm(data.company);

    address.company = company.name;
    address.vat = company.vat;
  }

  const loader = wait('Link this billing adddress to your account...');

  const res = await updateAction(token, {
    first_name: address.firstName,
    last_name: address.lastName,
    company: address.company,
    vat_number: address.vat,
    line1: address.address1,
    city: address.city,
    zip: address.zipCode,
    country: countries[address.country]
  });

  loader();

  if (res.error) {
    error(res.error);
    process.exit(1);
  }

  success('This billing address have been linked to you account');

  return address;
};
