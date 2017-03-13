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

// Utils.
const listInput = require('../utils/input/list');

// Loggers.
const wait = require('../utils/output/wait');

module.exports = async (token) => {
  const loader = wait('Load you applications...');

  const res = await getApplicationsAction(token);

  loader();

  const choices = _.map(res.applications, app => {
    return {
      name: app.name,
      value: app.name
    };
  });

  if (_.isEmpty(choices)) {
    return 'abort';
  }

  const choice = await listInput({
    message: 'Chose an application',
    choices,
    separator: false,
    abort: 'end'
  });

  if (!choice) {
    process.exit(1);
  }

  const application = _.find(res.applications, {
    name: choice
  });

  delete application.createdAt;
  delete application.updatedAt;
  delete application.subscription;

  fs.writeFileSync(path.resolve(process.cwd(), '.strapirc'), JSON.stringify(application), 'utf8');

  return choice;
};
