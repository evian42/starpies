'use strict';

/**
 * Module dependencies
 */

// Public dependencies
const ProgressBar = require('progress');

// prints a progress bar
module.exports = () => {
  const bar = new ProgressBar('[:bar] :percent - :title', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: 100
  });

  let progress = 0;

  function startDownload() {
    progress = 0;
    const interval = setInterval(() => {
      progress++;
      let message = '(Setup server)';

      if (progress < 50) {
        message = '(Setup domaine name)';
      }

      if (progress < 40) {
        message = '(Create server)';
      }

      bar.tick(1, {
        title: message
      });

      if (progress >= 98) {
        clearInterval(interval);
      }
    }, 700);
  }

  startDownload();

  return () => {
    return new Promise(resolve => {
      const interval = setInterval(() => {
        progress++;

        if (progress >= 100) {
          bar.tick(1, {
            title: '(Complete)'
          });

          clearInterval(interval);
          return resolve();
        } else {
          bar.tick(1, {
            title: '(Setup server)'
          });
        }
      }, 50);
    });
  };
};
