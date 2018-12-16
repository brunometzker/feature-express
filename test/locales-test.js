const chai = require('chai');
const expect = require('chai').expect;

const locales = require('../assets/js/locales');

describe('Locales test', () => {
  it('Should define LANGUAGES', () => {
    expect(locales).to.be.not.undefined;
  });
});
