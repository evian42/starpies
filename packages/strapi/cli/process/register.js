'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const fs = require('fs');
const path = require('path');

// Strapi services actions.
const signupAction = require('../actions/authSignup');
const signinAction = require('../actions/authSignin');
const sendCodeAction = require('../actions/sendCode');
const valideCodeAction = require('../actions/valideCode');

// Forms.
const signupForm = require('../forms/auth');
const codeForm = require('../forms/code');

// Loggers.
const error = require('../utils/output/error');
const success = require('../utils/output/success');
const info = require('../utils/output/info');
const wait = require('../utils/output/wait');

module.exports = async () => {
  let auth;

  async function signin() {
    const loader = wait('Auto login...');

    const res = await signinAction(auth);

    loader();

    if (res.error) {
      error('Incorrect credentials during signin');

      process.exit(1);
    } else {
      const HOME = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];

      fs.writeFileSync(path.resolve(HOME, '.strapirc'), JSON.stringify({
        id: res.profile.id,
        email: res.profile.email,
        token: res.token
      }), 'utf8');

      success(`You are successfully logged in as ${res.profile.fullname}`);

      return {
        id: res.profile.id,
        email: res.profile.email,
        token: res.token
      };
    }
  }

  async function code() {
    info('We send you an email with verification code');

    const code = await codeForm();

    const loader = wait('Valide your account...');

    const res = await valideCodeAction({
      email: auth.email,
      code: code
    });

    loader();

    if (res.error === 'invalid_code_timeout') {
      error('This code has expired, we send you a new code');

      await sendCodeAction({
        email: auth.email
      });

      return await code();
    } else if (res.error) {
      error('Error happend, contact us for support');

      process.exit(1);
    } else {
      return await signin();
    }
  }

  async function singup(email) {
    auth = await signupForm(email);

    let loader = wait('Register...');

    const res = await signupAction(auth);

    loader();

    if (res.error === 'invalid_email_exist') {
      error('This email is already exist');

      return await singup(auth.email);
    } else if (res.error) {
      error('Incorrect credentials');

      return await singup();
    } else {
      loader = wait('Send validation code...');

      await sendCodeAction({
        email: auth.email
      });

      loader();

      return await code();
    }
  }

  return singup();
};
