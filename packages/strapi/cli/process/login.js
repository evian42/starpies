'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const fs = require('fs');
const path = require('path');

// Signin form.
const signinForm = require('../forms/auth');

// Strapi services actions.
const signinAction = require('../actions/authSignin');

// Logger.
const error = require('../utils/output/error');
const success = require('../utils/output/success');

module.exports = async () => {
  async function login(email) {
    const auth = await signinForm(email);

    const res = await signinAction(auth);

    if (res.error === 'invalid_password') {
      error('Bad password');

      return await login(auth.email);
    } else if (res.error) {
      error('Incorrect credentials');

      return await login();
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

  return login();
};
