#!/usr/bin/env node

'use strict';

/**
 * Module dependencies
 */

// Login process.
const registerProcess = require('../process/register');

/**
 * `$ strapi register`
 *
 * Sigup to Strapi online services
 */

module.exports = async () => {
  await registerProcess();

  process.exit(1);
};
