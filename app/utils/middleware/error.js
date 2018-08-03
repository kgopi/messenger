'use strict';

function errorHandler (err, req, res, next) {

  if (!err.status || !err.message) {
    // log error stack
    req.log.error(err);

    // render 500 error page
    return res.status(500).json({message: 'Something went wrong.'});

  }

  // if status and message present that is controlled error from api
  // create error JSON for controlled errors

  const body = {
    message: err.message
  };

  // do not show default Error name
  if (err.name && err.name !== 'Error') body.name = err.name;

  // list of optional helpful messages to user
  if (err.debugInfo) body.debugInfo = err.debugInfo;

  res.status(err.status).json(body);
}

module.exports = errorHandler;
