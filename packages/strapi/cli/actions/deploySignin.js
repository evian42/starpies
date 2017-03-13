'use strict';

/**
 * Module dependencies
 */

// Public dependencies.
const fetch = require('node-fetch');

// Test is you have a Strapi Cloud account
module.exports = async (token) => {
  const url = 'http://localhost:1332';

  const res = await fetch(`${url}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  });

  return await res.json();
};
