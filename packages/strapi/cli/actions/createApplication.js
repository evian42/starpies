'use strict';

/**
 * Module dependencies
 */

// Public dependencies.
const fetch = require('node-fetch');

// Create a new application
module.exports = async (token, data) => {
  const url = 'http://localhost:1332';

  data = JSON.stringify(data);

  const res = await fetch(`${url}/application`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: data
  });

  return await res.json();
};
