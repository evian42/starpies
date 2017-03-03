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

// Utils
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
  } else if (isLogin === 'expire'){
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

  process.exit(1);
};
