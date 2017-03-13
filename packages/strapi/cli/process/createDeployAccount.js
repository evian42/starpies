'use strict';

/**
 * Module dependencies
 */

// Public node modules.
const _ = require('lodash');

// Strapi services actions.
const deploySignupAction = require('../actions/deploySignup');

// Utils.
const cmd = require('../utils/cmd');

// Loggers.
const error = require('../utils/output/error');
const wait = require('../utils/output/wait');

module.exports = async (token, id) => {
  const HOME = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
  const keyName = 'strapi_cloud';

  const resSshList = await cmd(`ls ${HOME}/.ssh`);

  let keys = _.filter(_.dropRight(resSshList.split('\n')), value => {
    return _.endsWith(value, '.pub');
  });

  const keyExist = _.indexOf(keys, `${keyName}.pub`) !== -1;

  if (!keyExist) {
    await cmd(`ssh-keygen -t rsa -C 'Strapi Cloud #${id}' -f ${HOME}/.ssh/${keyName} -N ''`);
    await cmd(`ssh-add -K ${HOME}/.ssh/${keyName}`);
  }

  const key = await cmd(`cat ${HOME}/.ssh/${keyName}.pub`);

  const loader = wait('Set up your deploy account...');

  const res = await deploySignupAction(token, {
    ssh: key
  });

  loader();

  if (res.error) {
    error(res.error);
    process.exit(1);
  }
};
