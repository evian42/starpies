'use strict';

/**
 * Module dependencies
 */

// Public dependencies
const chalk = require('chalk');

// prints an error message
module.exports = msg => {
  console.error(`${chalk.red('> Error!')} ${msg}`);
};
