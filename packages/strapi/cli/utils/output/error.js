'use strict';

/**
 * Module dependencies
 */

// Public dependencies
const chalk = require('chalk');

module.exports = msg => {
  console.error(`${chalk.red('> Error!')} ${msg}`);
};
