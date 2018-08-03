const jwt = require("jsonwebtoken");

module.exports = function VerifyClient(info, cb){

    return cb(true);

    // CORS validation
    const token = info.req.headers.token;
    if (!token)
        cb(false, 401, 'Unauthorized')
    else {
        jwt.verify(token, 'secret-key', function (err, decoded) {
            if (err) {
                cb(false, 401, 'Unauthorized')
            } else {
                info.req.user = decoded //[1]
                cb(true);
            }
        });
    }
}