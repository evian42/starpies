'use strict';

/**
 * Module dependencies
 */

// Public dependencies.
const fetch = require('node-fetch');

module.exports = async (data) => {
  const url = 'http://localhost:1331';

  data = JSON.stringify(data);

  const res = await fetch(`${url}/auth/validation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  });

  return await res.json();
};
