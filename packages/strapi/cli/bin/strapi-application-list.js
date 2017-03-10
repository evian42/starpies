#!/usr/bin/env node

'use strict';

/**
 * Module dependencies
 */

// Public dependencies.
const chalk = require('chalk');
const _ = require('lodash');

// Processes.
const isLoginProcess = require('../process/isLogin');
const loginProcess = require('../process/login');

// Strapi services actions.
const getApplicationsAction = require('../actions/getApplications');

// Logger.
const info = require('../utils/output/info');

/**
 * `$ strapi app:list`
 *
 * List applications on Strapi Cloud
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

  const res = await getApplicationsAction(auth.token);

  if (_.isEmpty(res.applications)) {
    info('You don\'t have application on Strapi Cloud');
    process.exit(1);
  }

  console.log(`\n${chalk.bold('Your applications on Strapi Cloud')}`);

  _.forEach(res.applications, application => {
    console.log(`> ${application.name}`);
  });

  console.log(' ');

  process.exit(1);
};
