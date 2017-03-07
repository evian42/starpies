'use strict';

/**
 * Module dependencies
 */

// Public dependencies.
const _ = require('lodash');

// Strapi services actions.
const getApplicationsAction = require('../actions/getApplications');

// Utils.
const listInput = require('../utils/input/list');

module.exports = async (token) => {
  const url = 'http://localhost:1332';

  const res = await getApplicationsAction(url, token);

  const choices = _.map(res.applications, app => {
    return {
      name: app.name,
      value: app.name
    };
  });

  const choice = await listInput({
    message: 'Chose an application',
    choices,
    separator: false,
    abort: 'end'
  });

  if (choice === 'abort') {
    process.exit(1);
  }

  return choice;
};
