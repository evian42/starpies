#!/usr/bin/env node

'use strict';

/**
 * Module dependencies
 */

// Node.js core
const fs = require('fs');
const path = require('path');

// Signin form.
const signinForm = require('../forms/signin');

// Strapi services actions.
const signinAction = require('../actions/authSignin');

// Logger.
const error = require('../utils/output/error');
const success = require('../utils/output/success');

/**
 * `$ strapi login`
 *
 * Sigin in to Strapi online services
 */

module.exports = async () => {
  var url = 'http://localhost:1331';

  async function action(email) {
    const auth = await signinForm(email);

    const res = await signinAction(url, auth);

    if (res.error === 'invalid_password') {
      error('Bad password');

      action(auth.email);
    } else if (res.error) {
      error('Incorrect credentials');

      action();
    } else {
      const HOME = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];

      fs.writeFileSync(path.resolve(HOME, '.strapirc'), JSON.stringify({
        email: res.profile.email,
        token: res.token
      }), 'utf8');

      success(`You are successfully logged in as ${res.profile.fullname}`);

      process.exit(1);
    }
  }

  action();
};
