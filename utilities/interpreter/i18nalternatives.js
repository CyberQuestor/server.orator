const i18n = require("i18n");

module.exports = {

  fetchi18n: function (){
    i18n.configure({
        locales:['en', 'en-GB', 'de'],
        directory: __dirname + '/../resources/locales',
        defaultLocale: 'en'
    });

    return i18n;
  }
}
