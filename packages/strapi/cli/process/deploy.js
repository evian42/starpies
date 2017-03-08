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

// Logger.
const wait = require('../utils/output/wait');

module.exports = async () => {
  return new Promise((resolve) => {
    let strapirc;

    try {
      strapirc = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '.strapirc'), 'utf8'));
    } catch(e) {
      return resolve('error');
    }

    const remoteName = 'strapi';

    console.log(' ');
    const spinner = wait(`Deploy ${strapirc.name} application...`);

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
