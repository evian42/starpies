'use strict';

/**
 * Module dependencies
 */

// Public dependencies
const chalk = require('chalk');

// prints an informational message
module.exports = msg => {
  console.log(`${chalk.gray('>')} ${msg}`);
};
