#!/usr/bin/env node

'use strict';

/**
 * Module dependencies
 */

// Processes.
const openProcess = require('../process/open');

/**
 * `$ strapi open`
 *
 * Open your application in a browser
 */

module.exports = async () => {
  await openProcess();

  process.exit(1);
};
