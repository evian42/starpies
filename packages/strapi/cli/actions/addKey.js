'use strict';

/**
 * Module dependencies
 */

// Public dependencies.
const fetch = require('node-fetch');

module.exports = async (token, app, data) => {
  const url = 'http://localhost:1332';

  data = JSON.stringify(data);

  const res = await fetch(`${url}/application/${app}/key`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: data
  });

  return await res.json();
};
