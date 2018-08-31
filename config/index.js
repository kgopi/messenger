
const PropertiesReader = require("properties-reader");
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
    config.rabbitmq = {
        host: env.RABBIT_MQ_HOST || '52.5.151.198',
        port: env.RABBIT_MQ_PORT || 5672,
        login: env.RABBIT_MQ_USERNAME || "abstract",
        password: env.RABBIT_MQ_PWD || "617EC7A6-60F8-4C2E-ADF1-667D0905D6D2",
        vhost: env.RABBIT_MQ_VHOST || "vabstract",
    };
    config.dbURI = env.MONGODB_CONNECTION_URL || `mongodb://devuser:FC235761-DDE2-41B9-A33E-210F783A21C1@54.86.218.91:27017/dev_rawdev1_db1`;
    
    return config;
}

module.exports = config;
module.exports.configure = configure;