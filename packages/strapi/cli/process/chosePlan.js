'use strict';

/**
 * Module dependencies
 */

// Public dependencies.
const _ = require('lodash');

// Strapi services actions.
const getPlansAction = require('../actions/getPlans');

// Utils.
const listInput = require('../utils/input/list');

module.exports = async (token, haveFreePlan, haveBilling) => {
  const url = 'http://localhost:1332';

  const res = await getPlansAction(url, token);

  if (!haveFreePlan) {
    res.plan = _.drop(res.plan);
  }

  if (!haveBilling) {
    res.plans = [res.plans[0]];
  }

  const choices = _.map(res.plans, plan => {
    return {
      name: `${_.capitalize(plan.plan.split('-')[1])} (${plan.price}€/month)`,
      value: plan.plan
    };
  });

  const choice = await listInput({
    message: 'Chose plan',
    choices,
    separator: false,
    abort: 'end'
  });

  if (choice === 'abort') {
    process.exit(1);
  }

  return choice;
};
