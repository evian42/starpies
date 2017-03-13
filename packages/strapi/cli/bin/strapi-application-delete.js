#!/usr/bin/env node

'use strict';

/**
 * Module dependencies
 */

// Processes.
const isLoginProcess = require('../process/isLogin');
const loginProcess = require('../process/login');
const deleteApplicationProcess = require('../process/deleteApplication');

// Loggers.
const info = require('../utils/output/info');

/**
 * `$ strapi app:list`
 *
 * Delete application on Strapi Cloud
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

  await deleteApplicationProcess(auth.token);

  console.log('');

  process.exit(1);
};
