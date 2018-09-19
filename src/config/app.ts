import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as responseTime from 'response-time';
import * as hrefs from "./../app/utils/href";
import bodyLogger from "./../app/utils/middleware/bodyLogger";
import errorHandler from "./../app/utils/middleware/error";
import * as logger from "./../app/utils/logger";

function configure(app, config) {

    hrefs.configure(config.apiHost, 'messenger');

    app.use(config.env === 'development' ? logger.development() : logger.production());
    app.use(require('./../app/utils/middleware/headers'));
    app.use(require('./../app/utils/middleware/parseUrl'));

    app.use(bodyParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(bodyLogger());

    app.use(cookieParser());
    app.use(responseTime());

    app.use(require('errorhandler')());
    app.use(errorHandler);

    require('../app/routes')(app);
}
  
  module.exports = configure;
  