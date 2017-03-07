'use strict';

/**
 * Module dependencies
 */

// Public dependencies.
const fetch = require('node-fetch');

module.exports = async (url, token, data) => {
  data = JSON.stringify(data);

  const res = await fetch(`${url}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: data
  });

  return await res.json();
};
