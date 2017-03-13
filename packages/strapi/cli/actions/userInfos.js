'use strict';

/**
 * Module dependencies
 */

// Public dependencies.
const fetch = require('node-fetch');

// Get you Strapi account informations
module.exports = async (token) => {
  const url = 'http://localhost:1331';

  const res = await fetch(`${url}/user/infos`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  });

  return await res.json();
};
