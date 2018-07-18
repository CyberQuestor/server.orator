// fondly known as Response Code

const Enum = require('enum');
const responseCode = new Enum({
  'UnrecognizedException':'Someone tried to use unrecognized command!',
  'UnrecognizedSomeoneException': 'Someone else tried to do this again!'
});

module.exports = {

  // const rode = {
  //   '8001': 'Someone tried to use unrecognized command!',
  //   '8002': 'Someone else tried to do this again!'
  // };

  // const ResponseCode = Object.freeze(rode);

  fetchResponseCode: function () {
    return responseCode;
  }
}
