'use strict';

/**
 * Module dependencies
 */

// Public dependencies
const chalk = require('chalk');

module.exports = msg => {
  console.log(`${chalk.gray('>')} ${msg}`);
};
