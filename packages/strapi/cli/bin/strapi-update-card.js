#!/usr/bin/env node

'use strict';

/**
 * Module dependencies
 */

// Processes.
const isLoginProcess = require('../process/isLogin');
const loginProcess = require('../process/login');
const updateCardProcess = require('../process/updateCard');

// Logger.
const info = require('../utils/output/info');

/**
 * `$ strapi update:card`
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

  await updateCardProcess(auth.token);

  process.exit(1);
};
