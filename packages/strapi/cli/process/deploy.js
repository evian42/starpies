'use strict';

/**
 * Module dependencies
 */

// Node.js core.
const fs = require('fs');
const path = require('path');

// Public dependencies.
const _ = require('lodash');
const git = require('simple-git')();

// Strapi services actions.
const addKeyAction = require('../actions/addKey');

// Utils.
const cmd = require('../utils/cmd');

// Logger.
const error = require('../utils/output/error');
const wait = require('../utils/output/wait');

module.exports = async (token, id) => {
  return new Promise(async (resolve) => {
    const HOME = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
    let strapirc;

    try {
      strapirc = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '.strapirc'), 'utf8'));
    } catch(e) {
      return resolve('error');
    }

    const remoteName = 'strapi';
    const keyName = 'strapi_cloud';

    console.log(' ');
    let spinner = wait('SSH keys verification...');

    const resSshList = await cmd(`ls ${HOME}/.ssh`);

    let keys = _.filter(_.dropRight(resSshList.split('\n')), value => {
      return _.endsWith(value, '.pub');
    });

    const keyExist = _.indexOf(keys, `${keyName}.pub`) !== -1;

    if (!keyExist) {
      await cmd(`ssh-keygen -t rsa -C 'Strapi Cloud #${id}' -f ${HOME}/.ssh/${keyName} -N ''`);
    }

    const key = await cmd(`cat ${HOME}/.ssh/${keyName}.pub`);

    const res = await addKeyAction(token, strapirc.name, {
      key: key
    });

    if (res.error) {
      spinner();
      error(res.error);
      process.exit(1);
    }

    await cmd(`ssh-keygen -R ${strapirc.name}.strapiapp.com `);
    await cmd(`ssh-keyscan ${strapirc.name}.strapiapp.com >> ${HOME}/.ssh/known_hosts`);
    await cmd(`ssh-keyscan ${strapirc.name}.strapiapp.com >> ${HOME}/.ssh/known_hosts`);
    await cmd(`ssh-add -K ${HOME}/.ssh/strapi_cloud`);

    spinner();

    spinner = wait(`Deploy ${strapirc.name} application...`);

    git.init()
    .then(() => {
      return git.add('./*').commit('Deploy to Strapi Cloud');
    })
    .then(function() {
      git.getRemotes((err, data) => {
        const remote = _.find(data, {
          name: remoteName
        });

        if (!remote) {
          git.addRemote(remoteName, strapirc.git)
            .outputHandler((command, stdout, stderr) => {
              stdout.pipe(process.stdout);
              stderr.pipe(process.stderr);
            })
            .push(remoteName, 'master', () => {
              spinner();
              resolve();
            });
        } else {
          git.outputHandler((command, stdout, stderr) => {
            stdout.pipe(process.stdout);
            stderr.pipe(process.stderr);
          })
          .push(remoteName, 'master', () => {
            spinner();
            resolve();
          });
        }
      });
    });
  });
};
