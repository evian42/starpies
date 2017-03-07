'use strict';

/**
 * Module dependencies
 */

// Strapi services actions.
const createApplicationAction = require('../actions/createApplication');

// Logger.
const success = require('../utils/output/success');
const error = require('../utils/output/error');
const wait = require('../utils/output/wait');

module.exports = async (token, appName, plan) => {
  const url = 'http://localhost:1332';

  console.log(' ');
  const spinner = wait(`Create ${appName} application...`);

  const res = await createApplicationAction(url, token, {
    name: appName,
    plan: plan
  });

  spinner();

  if (res.error) {
    error(res.error);
    process.exit(1);
  } else {
    success('Application have been created!');
  }
};
