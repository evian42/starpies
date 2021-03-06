#!/usr/bin/env node

'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const cp = require('child_process');
const path = require('path');

// Public dependencies
const _ = require('lodash');
const forever = require('forever-monitor');
const semver = require('semver')

// Local Strapi dependencies.
const isLocalStrapiValid = require('../lib/private/isLocalStrapiValid');

// Logger.
const { logger, cli } = require('strapi-utils');

/**
 * `$ strapi start`
 *
 * Expose method which starts the appropriate instance of Strapi
 * (fire up the application in our working directory).
 */

module.exports = function() {
  // Check that we're in a valid Strapi project.
  if (!cli.isStrapiApp()) {
    return logger.error('This command can only be used inside a Strapi project.');
  }

  try {
    // Set NODE_ENV
    if (_.isEmpty(process.env.NODE_ENV)) {
      process.env.NODE_ENV = 'development';
    }

    // Require server configurations
    const server = require(path.resolve(
      process.cwd(),
      'config',
      'environments',
      'development',
      'server.json'
    ));

    if (process.env.NODE_ENV === 'development' && server.reload === true) {
      const options = _.assign(
        {},
        {
          silent: false,
          watch: true,
          watchDirectory: process.cwd(),
          watchIgnoreDotFiles: true, // Whether to ignore file starting with a '.'
          watchIgnorePatterns: [
            'node_modules/**/*',
            'public/**/*',
            '.git/**/*',
            '.idea'
          ], // Ignore patterns to use when watching files.
          killTree: true, // Kills the entire child process tree on `exit`,
          spinSleepTime: 0,
          command: 'node'
        }
      );

      const child = new forever.Monitor('server.js', options);

      // Run listeners
      child.on('watch:restart', info => {
        logger.verbose(
          'Restarting due to ' +
          info.file +
          '... (' +
          info.stat.replace(child.cwd, '.') +
          ')'
        );
        console.log();
      });

      child.on('exit:code', function(code) {
        if (code) {
          process.exit(code);
        }
      });

      // Start child process
      return child.start();
    }

    // Run app as a child_process when harmony flag is not detected.
    if (!~process.execArgv.indexOf('--harmony')) {
      const opts = Object.create(process.env);

      // Apply harmony flag only when we are able to.
      if (semver.lt(process.version, '8.0.0') && semver.gt(process.version, '7.0.0')) {
        opts.execArgv = ['--harmony-async-await'];
      }

      return cp.fork(path.resolve(process.cwd(), 'server.js'), opts);
    }

    // Use the app's local `strapi` in `node_modules` if it's existant and valid.
    const localStrapiPath = path.resolve(
      process.cwd(),
      'node_modules',
      'strapi'
    );

    if (isLocalStrapiValid(localStrapiPath, process.cwd())) {
      return require(localStrapiPath).start(afterwards);
    }

    // Otherwise, if no workable local `strapi` module exists,
    // run the application using the currently running version
    // of `strapi`. This is probably always the global install.
    return require('strapi').start(afterwards);
  } catch (e) {
    logger.error(e);
    process.exit(0);
  }
};

function afterwards(err, strapi) {
  if (err) {
    logger.error(err.stack ? err.stack : err);

    strapi ? strapi.stop() : process.exit(1);
  }
}
