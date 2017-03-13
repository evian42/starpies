'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const fs = require('fs');
const path = require('path');

// Public dependencies.
const _ = require('lodash');

// Strapi services actions.
const getApplicationsAction = require('../actions/getApplications');

// Loggers.
const wait = require('../utils/output/wait');

module.exports = async (token) => {
  try {
    const strapirc = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '.strapirc'), 'utf8'));

    const loader = wait('Check application status...');

    const res = await getApplicationsAction(token);

    loader();

    if (res.error) {
      return res.error;
    }

    const app = _.find(res.applications, {
      name: strapirc.name
    });

    return (app) ? app : 'expire';

  } catch(e) {
    return 'not_deploy';
  }
};
