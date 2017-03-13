#!/usr/bin/env node

'use strict';

/**
 * Module dependencies
 */

// Processes.
const registerProcess = require('../process/register');

/**
 * `$ strapi register`
 *
 * Sigup to Strapi online services
 */

module.exports = async () => {
  await registerProcess();

  console.log('');

  process.exit(1);
};
