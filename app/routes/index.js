'use strict';

const express = require('express');
const urls = require('./urls');
const router = express.Router();
const cors = require('cors');

function routes(app) {
    // Allow the api to accept request from web app
    router.use(cors({
        origin: '*',
        methods: 'GET,HEAD,OPTIONS'
    }));

    // enable cors preflight for all endpoints
    router.options('*', cors());
    router.route(urls.token.toString()).get(require("./../controllers/getAuthToken"));
    router.route(urls.broadcast.toString()).post(require("./../controllers/broadcast"));

    app.use('/messenger', router); // :version should be changed to version number
}

module.exports = routes;