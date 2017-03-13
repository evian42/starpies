'use strict';

/**
 * Module dependencies
 */

// Public dependencies
const ProgressBar = require('progress');

module.exports = () => {
  const bar = new ProgressBar('[:bar] :percent - :title', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: 100
  });

  let progress = 0;

  function startDownload() {
    const interval = setInterval(() => {
      progress++;
      let message = '(Setup server)';

      if (progress < 50) {
        message = '(Setup domaine name)';
      }

      if (progress < 40) {
        message = '(Create server)';
      }

      if (progress >= 98 || bar.complete) {
        return clearInterval(interval);
      }

      bar.tick(1, {
        title: message
      });
    }, 700);
  }

  startDownload();

  return () => {
    return new Promise(resolve => {
      const interval = setInterval(() => {
        bar.tick(1, {
          title: '(Complete)'
        });

        if (bar.complete) {
          clearInterval(interval);
          return resolve();
        }
      }, 50);
    });
  };
};
