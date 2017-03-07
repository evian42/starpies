'use strict';

/**
 * Module dependencies
 */

// Public dependencies.
const chalk = require('chalk');
const ccValidator = require('credit-card');

// Utils.
const textInput = require('../utils/input/text');
const countries = require('../utils/billing/country-list');
const cardBrands = require('../utils/billing/card-brands');

function rightPad(string, n = 12) {
  n -= string.length;
  return string + ' '.repeat(n > -1 ? n : 0);
}

function expDateMiddleware(data) {
  return data;
}

module.exports = async () => {
  const state = {
    error: undefined,
    cardGroupLabel: `> ${chalk.bold('Enter your card details')}`,

    cardNumber: {
      label: rightPad('Number'),
      mask: 'cc',
      placeholder: '#### #### #### ####',
      validateKeypress: (data, value) => (
        /\d/.test(data) && value.length < 19
      ),
      validateValue: data => {
        data = data.replace(/ /g, '');

        const type = ccValidator.determineCardType(data);

        if (!type) {
          return false;
        }

        return ccValidator.isValidCardNumber(data, type);
      }
    },

    ccv: {
      label: rightPad('CCV'),
      mask: 'ccv',
      placeholder: '###',
      validateValue: data => {
        const brand = state.cardNumber.brand.toLowerCase();
        return ccValidator.doesCvvMatchType(data, brand);
      }
    },

    expDate: {
      label: rightPad('Exp. Date'),
      mask: 'expDate',
      placeholder: 'mm / yyyy',
      middleware: expDateMiddleware,
      validateValue: data => !ccValidator.isExpired(...data.split(' / '))
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
    }
  };

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

          if (key === 'cardNumber') {
            let brand = cardBrands[ccValidator.determineCardType(result)];
            piece.brand = brand;

            if (brand === 'American Express') {
              state.ccv.placeholder = '#'.repeat(4);
            } else {
              state.ccv.placeholder = '#'.repeat(3);
            }

            brand = chalk.cyan(`[${brand}]`);

            const masked = chalk.gray('#### '.repeat(3)) + result.split(' ')[3];

            process.stdout.write(`${chalk.cyan('✓')} ${piece.label}${masked} ${brand}\n`);
          } else if (key === 'ccv') {
            process.stdout.write(`${chalk.cyan('✓')} ${piece.label}${'*'.repeat(result.length)}\n`);
          } else if (key === 'expDate') {
            let text = result.split(' / ');
            text = text[0] + chalk.gray(' / ') + text[1];

            process.stdout.write(`${chalk.cyan('✓')} ${piece.label}${text}\n`);
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
      cardNumber: state.cardNumber.value,
      ccv: state.ccv.value,
      expDate: state.expDate.value,
      country: state.country.value
    };
  }

  return render().catch(console.error);
};
