'use strict';

var express = require('express');
var urls = require('./urls');
var router = express.Router();
var cors = require('cors');

function routes(app) {
    // Allow the api to accept request from web app
    router.use(cors({
        origin: '*',
        methods: 'GET,HEAD,OPTIONS'
    }));

    // enable cors preflight for all endpoints
    router.options('*', cors());
    router.route('*').all(require('./../../config/authenticate'));
    router.route(urls.token.toString()).get(require("./../controllers/getAuthToken"));

    app.use('/messenger', router); // :version should be changed to version number
}

module.exports = routes;