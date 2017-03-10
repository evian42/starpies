'use strict';

/**
 * Module dependencies
 */

// Public dependencies.
const _ = require('lodash');

// Strapi services actions.
const getPlansAction = require('../actions/getPlans');

// Processes.
const haveFreePlanProcess = require('../process/haveFreePlan');
const haveBillingAddressProcess = require('../process/haveBillingAddress');
const haveBillingCardProcess = require('../process/haveBillingCard');
const updateCardProcess = require('../process/updateCard');
const updateAddressProcess = require('../process/updateAddress');

// Utils.
const listInput = require('../utils/input/list');

// Logger.
const wait = require('../utils/output/wait');

module.exports = async (token) => {
  let loader = wait('Load Strapi Cloud plans...');

  const res = await getPlansAction(token);

  loader();

  const haveFreePlan = await haveFreePlanProcess(token);

  if (!haveFreePlan) {
    res.plan = _.drop(res.plan);
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

  if (!choice) {
    process.exit(1);
  }

  const plan = _.find(res.plans, {
    plan: choice
  });

  if (plan.price > 0) {
    let card = {};

    const haveBillingCard = await haveBillingCardProcess(token);

    if (!haveBillingCard) {
      card = await updateCardProcess(token);
    }

    const haveBillingAddress = await haveBillingAddressProcess(token);

    if (!haveBillingAddress) {
      await updateAddressProcess(token, {
        country: card.country
      });
    }
  }


  return choice;
};
