#!/usr/bin/env node

'use strict';

/**
 * Module dependencies
 */

// Processes.
const loginProcess = require('../process/login');
const registerProcess = require('../process/register');
const isLoginProcess = require('../process/isLogin');
const haveDeployAccountProcess = require('../process/haveDeployAccount');
const createDeployAccountProcess = require('../process/createDeployAccount');
const haveFreePlanProcess = require('../process/haveFreePlan');
const isDeployProcess = require('../process/isDeploy');
const chosePlanProcess = require('../process/chosePlan');
const linkProcess = require('../process/link');

// App name form.
const appNameForm = require('../forms/appName');

// Utils.
const listInput = require('../utils/input/list');

/**
 * `$ strapi deploy`
 *
 * Deploy your application on Strapi Cloud
 */

module.exports = async () => {
  const isLogin = await isLoginProcess();
  let auth;

  if (typeof isLogin === 'object') {
    auth = isLogin;
  } else if (isLogin === 'expire') {
    auth = await loginProcess();
  } else {
    const choice = await listInput({
      message: 'You have to be authenticated to deploy you application',
      choices: [{
        name: 'I already have an account',
        value: 'login',
        short: 'Login'
      },
      {
        name: 'Create my account',
        value: 'register',
        short: 'Register'
      }],
      separator: false,
      abort: 'end'
    });

    if (choice === 'login') {
      auth = await loginProcess();
    } else if (choice === 'register') {
      auth = await registerProcess();
    } else {
      process.exit(1);
    }
  }

  const haveDeployAccount = await haveDeployAccountProcess(auth.token);

  if (!haveDeployAccount) {
    await createDeployAccountProcess(auth.token);
  }

  const haveFreePlan = await haveFreePlanProcess(auth.token);

  if (!haveFreePlan) {
    console.log('Have to setup credit card and billing address');
  }

  const isDeploy = await isDeployProcess(auth.token);

  if (typeof isDeploy !== 'object') {
    const choice = await listInput({
      message: 'You already have an application for this project?',
      choices: [{
        name: 'Create new application',
        value: 'create',
        short: 'Create'
      },
      {
        name: 'Link to an existing application',
        value: 'link',
        short: 'Link'
      }],
      separator: false,
      abort: 'end'
    });

    if (choice === 'create') {
      const appName = await appNameForm();
      const plan = await chosePlanProcess(auth.token, haveFreePlan);

      console.log(`Create ${appName} with ${plan} plan`);
    } else if (choice === 'link') {
      await linkProcess();
    } else {
      process.exit(1);
    }
  }

  process.exit(1);
};
