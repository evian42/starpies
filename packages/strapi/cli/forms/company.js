'use strict';

/**
 * Module dependencies
 */

// Public dependencies.
const chalk = require('chalk');
const _ = require('lodash');

// Utils.
const textInput = require('../utils/input/text');

function rightPad(string, n = 12) {
  n -= string.length;
  return string + ' '.repeat(n > -1 ? n : 0);
}

module.exports = async (data) => {
  const state = {
    error: undefined,
    name: {
      label: rightPad('Company'),
      placeholder: 'Strapi Solution',
      validateValue: data => data.trim().length > 0
    },
    vat: {
      label: rightPad('VAT number'),
      placeholder: '',
      validateValue: data => data.trim().length > 0
    }
  };

  if (_.indexOf(['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
    'DE', 'GB', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL',
    'PT', 'RO', 'SK', 'SI', 'ES', 'SE'], data.country) === -1) {
    delete state.vat;
    delete data.vat;
  }

  delete data.country;

  _.forEach(data, function(value, key) {
    state[key].initialValue = value;
  });

  async function render() {
    for (const key in state) {
      if (!Object.hasOwnProperty.call(state, key)) {
        continue;
      }

      const piece = state[key];
      if (typeof piece === 'string') {
        console.log(piece);
      } else if (typeof piece === 'object') {
        let result;

        try {
          result = await textInput({
            label: '- ' + piece.label,
            initialValue: piece.initialValue || piece.value,
            placeholder: piece.placeholder,
            mask: piece.mask,
            validateKeypress: piece.validateKeypress,
            validateValue: piece.validateValue,
            autoComplete: piece.autoComplete
          });

          piece.value = result;

          if (key === 'vat') {
            result = _.filter(result, function(value) {
              return (!isNaN(parseInt(value)));
            });
            result = result.join('');

            piece.value = result;
            process.stdout.write(`${chalk.cyan('✓')} ${piece.label}${result}\n`);
          } else {
            process.stdout.write(`${chalk.cyan('✓')} ${piece.label}${result}\n`);
          }
        } catch (err) {
          if (err.message === 'USER_ABORT') {
            process.exit(1);
          } else {
            console.error(err);
          }
        }
      }
    }

    return {
      name: state.name.value,
      vat: (state.vat) ? state.vat.value : undefined,
    };
  }


  return render().catch(console.error);
};
