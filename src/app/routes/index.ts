import * as express from 'express';
import {urls} from './urls';
const router = express.Router();
import * as cors from 'cors';

import {getAuthToken} from "./../controllers/getAuthToken";
import {EventsController} from "./../controllers/event";
import {PreferencesController} from "./../controllers/preferences";
import {default as BroadCast} from "./../controllers/broadcast";

export function routes(app) {
    
    // Allow the api to accept request from web app
    router.use(cors({
        origin: '*',
        methods: 'GET,HEAD,OPTIONS,POST'
    }));

    // enable cors preflight for all endpoints
    router.options('*', cors());

    router.route(urls.token.toString()).get(getAuthToken);
    router.route(urls.list.toString()).get(EventsController.list);
    router.route(urls.subscribe2Entity.toString()).get(PreferencesController.subscribe2Entity);
    router.route(urls.unsubscribe2Entity.toString()).get(PreferencesController.unSubscribe2Entity);
    router.route(urls.subscribe2Event.toString()).get(PreferencesController.subscribe2Event);
    router.route(urls.unsubscribe2Event.toString()).post(PreferencesController.unSubscribe2Event);
    router.route(urls.preferences.toString()).get(PreferencesController.getUserPreferences);
    router.route(urls.broadcast.toString()).post(BroadCast);

    app.use('/messenger', router); // :version should be changed to version number
}