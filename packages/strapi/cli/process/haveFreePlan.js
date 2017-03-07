'use strict';

/**
 * Module dependencies
 */

// Public dependencies.
const moment = require('moment');
const _ = require('lodash');

// Strapi services actions.
const getSubscriptionsAction = require('../actions/getSubscriptions');
const getApplicationsAction = require('../actions/getApplications');

// Logger.
const error = require('../utils/output/error');

module.exports = async (token) => {
  const urlUser = 'http://localhost:1331';
  const urlDeploy = 'http://localhost:1332';

  let res = await getSubscriptionsAction(urlUser, token);

  if (res.error) {
    error(res.error);
    process.exit(1);
  }

  const subscriptions = res.subscriptions;

  const dateNow = moment(new Date().getTime());
  const freePlan = _.find(subscriptions, function(sub) {
    return (sub.plan_id === 'deploy-free' && sub.status === 'in_trial' && dateNow.isBefore(moment(sub.trial_end * 1000)));
  });

  if (freePlan) {
    let res = await getApplicationsAction(urlDeploy, token);

    if (res.error) {
      error(res.error);
      process.exit(1);
    }

    const applications = res.applications;

    const application = _.find(applications, function(app) {
      return (freePlan.id == app.subscription);
    });

    if (!application) {
      return true;
    }
  }

  return false;
};
