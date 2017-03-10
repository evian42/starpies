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
const wait = require('../utils/output/wait');

module.exports = async (token) => {
  const loader = wait('Check your free plan status...');

  let res = await getSubscriptionsAction(token);

  if (res.error) {
    loader();
    error(res.error);
    process.exit(1);
  }

  const subscriptions = res.subscriptions;

  const dateNow = moment(new Date().getTime());
  const freePlan = _.find(subscriptions, function(sub) {
    return (sub.plan_id === 'deploy-free' && sub.status === 'in_trial' && dateNow.isBefore(moment(sub.trial_end * 1000)));
  });

  if (freePlan) {
    let res = await getApplicationsAction(token);

    loader();

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

  loader();

  return false;
};
