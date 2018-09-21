import * as express from 'express';
import {urls} from './urls';
const router = express.Router();
import * as cors from 'cors';

import {getAuthToken} from "./../controllers/getAuthToken";
import {EventsController} from "./../controllers/event";
import {} from "./../controllers/broadcast";

export function routes(app) {
    
    // Allow the api to accept request from web app
    router.use(cors({
        origin: '*',
        methods: 'GET,HEAD,OPTIONS'
    }));

    // enable cors preflight for all endpoints
    router.options('*', cors());

    router.route(urls.token.toString()).get(getAuthToken);
    router.route(urls.list.toString()).get(EventsController.list);
    router.route(urls.inactivate.toString()).post(EventsController.makeItRead);
    // router.route(urls.broadcast.toString()).post(require("./../controllers/broadcast"));
    // router.route(urls.userPreferences.toString()).get(require("./../services/settings").get);
    // router.route(urls.userPreferences.toString()).post(require("./../services/settings").update);

    app.use('/messenger', router); // :version should be changed to version number
}