const zlib = require('zlib');

function getAuthToken (req, res, next) {
  debugger;
  zlib.gzip(req.headers.requestinfo, function (_, result) {
    res.status(200).json({'key': 'key'});
  });
}
  
  module.exports = getAuthToken;