// fondly known as Response Code

const Enum = require('enum');
const responseCode = new Enum({
  'UnrecognizedException':'Someone tried to use unrecognized command!',
  'UnrecognizedSomeoneException': 'Someone else tried to do this again!',
  'ParsingPrefixException': 'Unable to parse prefix!',
  'InvalidCredentialsException': 'You are not playing by rules!'
});

module.exports = {
  fetchResponseCode: function () {
    return responseCode;
  }
}
