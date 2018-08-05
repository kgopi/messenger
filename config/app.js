const bodyParser = require('body-parser');
const cookieParser   = require('cookie-parser');
const responseTime   = require('response-time');
const hrefs = require("./../app/utils/href");
const bodyLogger = require("./../app/utils/middleware/bodyLogger");
const errorHandler = require("./../app/utils/middleware/error");
const logger = require("./../app/utils/logger");

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
    app.use(require('./../app/utils/middleware/error'));
}
  
  module.exports = configure;
  