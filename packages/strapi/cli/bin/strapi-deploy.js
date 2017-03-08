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
const createApplicationProcess = require('../process/createApplication');
const deployProcess = require('../process/deploy');

// App name form.
const appNameForm = require('../forms/appName');

// Utils.
const listInput = require('../utils/input/list');

// Logger.
const info = require('../utils/output/info');

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

  const isDeploy = await isDeployProcess(auth.token);
  const haveDeployAccount = await haveDeployAccountProcess(auth.token);
  const haveFreePlan = await haveFreePlanProcess(auth.token);

  if (!haveDeployAccount) {
    await createDeployAccountProcess(auth.token);
  }

  if (typeof isDeploy !== 'object') {
    if (!haveFreePlan) {
      console.log('Have to setup credit card and billing address');
    }

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

    if (!choice) {
      process.exit(1);
    }

    let link;
    if (choice === 'link') {
      link = await linkProcess(auth.token);

      if (link === 'abort') {
        info('You don\'t have projects, we automaticaly switch to create new project');
      }
    }

    if (choice === 'create' || link === 'abort') {
      const appName = await appNameForm();
      const plan = await chosePlanProcess(auth.token, haveFreePlan);

      await createApplicationProcess(auth.token, appName, plan);
    }
  }

  await deployProcess();

  process.exit(1);
};
