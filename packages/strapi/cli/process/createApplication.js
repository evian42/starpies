'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const fs = require('fs');
const path = require('path');

// Strapi services actions.
const createApplicationAction = require('../actions/createApplication');

// Logger.
const success = require('../utils/output/success');
const error = require('../utils/output/error');
const info = require('../utils/output/info');
const progress = require('../utils/output/progress');

module.exports = async (token, appName, plan) => {
  console.log(' ');
  info(`Create ${appName} application...`);
  const progressBar = progress();

  const res = await createApplicationAction(token, {
    name: appName,
    plan: plan
  });

  await progressBar();

  if (res.error) {
    error(res.error);
    process.exit(1);
  }

  delete res.application.createdAt;
  delete res.application.updatedAt;

  fs.writeFileSync(path.resolve(process.cwd(), '.strapirc'), JSON.stringify(res.application), 'utf8');

  success('Application have been created!');
};
