'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const fs = require('fs');
const path = require('path');

// Signup form.
const signupForm = require('../forms/auth');
const codeForm = require('../forms/code');

// Strapi services actions.
const signupAction = require('../actions/authSignup');
const signinAction = require('../actions/authSignin');
const sendCodeAction = require('../actions/sendCode');
const valideCodeAction = require('../actions/valideCode');

// Logger.
const error = require('../utils/output/error');
const success = require('../utils/output/success');
const info = require('../utils/output/info');

module.exports = async () => {
  let auth;

  async function signin() {
    const res = await signinAction(auth);

    if (res.error) {
      error('Incorrect credentials during signin');

      process.exit(1);
    } else {
      const HOME = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];

      fs.writeFileSync(path.resolve(HOME, '.strapirc'), JSON.stringify({
        email: res.profile.email,
        token: res.token
      }), 'utf8');

      success(`You are successfully logged in as ${res.profile.fullname}`);

      return {
        email: res.profile.email,
        token: res.token
      };
    }
  }

  async function code() {
    info('We send you an email with verification code');

    const code = await codeForm();

    const res = await valideCodeAction({
      email: auth.email,
      code: code
    });

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

    const res = await signupAction(auth);

    if (res.error === 'invalid_email_exist') {
      error('This email is already exist');

      return await singup(auth.email);
    } else if (res.error) {
      error('Incorrect credentials');

      return await singup();
    } else {
      await sendCodeAction({
        email: auth.email
      });

      return await code();
    }
  }

  return singup();
};
