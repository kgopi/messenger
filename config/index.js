
const config = {};

function configure(env) {
    config.apiHost = env.API_HOST || 'http://localhost:8880';
    config.listenPort = env.API_LISTEN_PORT || 8880;
    config.apiVersion = "v1.0";
    return config;
}

module.exports = config;
module.exports.configure = configure;