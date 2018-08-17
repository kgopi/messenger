
const config = {};

function configure(env) {
    config.appName = "informer";
    config.environment = env.ENV || 'prod';
    config.listenPort = env.API_LISTEN_PORT || 8880;
    config.mdaSecretKeyPassword = env.MDA_SECRET_KEY_PWD || "69afc10c0920e48705da806ffb3b010b1b072968f27fbcd0b82c3294396208b9";
    config.mdaSecretKey = env.MDA_SECRET_KEY || "abc";
    config.workers = 2,//Number(env.SOCKETCLUSTER_WORKERS) || require('os').cpus().length;
    config.brokers = Number(env.SOCKETCLUSTER_BROKERS) || 1;
    config.socketChannelLimit = Number(env.SOCKETCLUSTER_SOCKET_CHANNEL_LIMIT) || 1000;
    return config;
}

module.exports = config;
module.exports.configure = configure;