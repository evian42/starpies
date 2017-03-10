'use strict';

/**
 * Module dependencies
 */

// Public dependencies.
const _ = require('lodash');

// Strapi services actions.
const getApplicationsAction = require('../actions/getApplications');
const deleteApplicationAction = require('../actions/deleteApplication');

// Validation form.
const deleteForm = require('../forms/delete');

// Utils.
const listInput = require('../utils/input/list');

// Logger.
const success = require('../utils/output/success');
const info = require('../utils/output/info');
const error = require('../utils/output/error');
const wait = require('../utils/output/wait');

module.exports = async (token) => {
  let loader = wait('Load your applications...');

  let res = await getApplicationsAction(token);

  loader();

  if (_.isEmpty(res.applications)) {
    info('You don\'t have application on Strapi Cloud');
    process.exit(1);
  }

  const choices = _.map(res.applications, app => {
    return {
      name: app.name,
      value: app.name
    };
  });

  const choice = await listInput({
    message: 'Chose an application to delete',
    choices,
    separator: false,
    abort: 'end'
  });

  if (!choice) {
    process.exit(1);
  }

  await deleteForm(choice);

  loader = wait(`Delete ${choice} application...`);

  res = await deleteApplicationAction(token, {
    name: choice
  });

  loader();

  if (res.error) {
    error(res.error);
    process.exit(1);
  }

  success(`Application ${choice} have been deleted`);
};
