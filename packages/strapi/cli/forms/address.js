'use strict';

/**
 * Module dependencies
 */

// Public dependencies.
const chalk = require('chalk');
const _ = require('lodash');

// Utils.
const textInput = require('../utils/input/text');
const countries = require('../utils/billing/country-list');
const geocode = require('../utils/billing/geocode');
const wait = require('../utils/output/wait');

function rightPad(string, n = 12) {
  n -= string.length;
  return string + ' '.repeat(n > -1 ? n : 0);
}

module.exports = async (data) => {
  const state = {
    error: undefined,
    addressGroupLabel: `\n> ${chalk.bold('Enter your billing address')}`,

    firstName: {
      label: rightPad('First Name'),
      placeholder: 'John',
      validateValue: data => data.trim().length > 0
    },

    lastName: {
      label: rightPad('Last Name'),
      placeholder: 'Doe',
      validateValue: data => data.trim().length > 0
    },

    country: {
      label: rightPad('Country'),
      async autoComplete(value) {
        for (const country in countries) {
          if (!Object.hasOwnProperty.call(countries, country)) {
            continue;
          }

          if (country.startsWith(value)) {
            return country.substr(value.length);
          }
        }

        return false;
      },
      validateValue: value => countries[value] !== undefined
    },

    zipCode: {
      label: rightPad('ZIP'),
      validadeKeypress: data => data.trim().length > 0,
      validateValue: data => data.trim().length > 0
    },

    city: {
      label: rightPad('City'),
      validateValue: data => data.trim().length > 0
    },

    address1: {
      label: rightPad('Address'),
      validateValue: data => data.trim().length > 0
    }
  };

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

          if (key === 'zipCode') {
            const stopSpinner = wait(piece.label + result);

            const addressInfo = await geocode({
              country: state.country.value,
              zipCode: result
            });

            if (addressInfo.city) {
              state.city.initialValue = addressInfo.city;
            }

            stopSpinner();

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
      firstName: state.firstName.value,
      lastName: state.lastName.value,
      country: state.country.value,
      zipCode: state.zipCode.value,
      city: state.city.value,
      address1: state.address1.value
    };
  }

  return render().catch(console.error);
};
