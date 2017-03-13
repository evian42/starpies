'use strict';

/**
 * Module dependencies
 */

// Public dependencies.
const fetch = require('node-fetch');

// Update your billing address
module.exports = async (token, data) => {
  const url = 'http://localhost:1331';

  data = JSON.stringify(data);

  const res = await fetch(`${url}/user/billing`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: data
  });

  return await res.json();
};
