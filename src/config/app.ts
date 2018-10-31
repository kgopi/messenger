import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as responseTime from 'response-time';
import * as hrefs from "./../app/utils/href";
import bodyLogger from "./../app/utils/middleware/bodyLogger";
import errorHandler from "./../app/utils/middleware/error";
import * as logger from "./../app/utils/logger";
import {routes} from "./../app/routes";
import {db} from "./../app/db";

export function configureApp(app, config) {

    hrefs.configure(config.apiHost, 'messenger');

    app.use(config.environment === 'development' ? logger.development() : logger.production());
    app.use(require('./../app/utils/middleware/headers'));
    app.use(require('./../app/utils/middleware/parseUrl'));

    app.use(db.initDb);

    app.use(bodyParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());

    app.use(cookieParser());
    app.use(responseTime());

    app.use(require('errorhandler')());
    app.use(errorHandler);

    routes(app);
}  