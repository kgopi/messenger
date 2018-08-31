
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
    config.confFilePath = env.CONF_FILE_PATH || "/../gs-env/abstract.conf";
    config.rabbitmq = {
        host: env.RABBIT_MQ_HOST || '52.5.151.198',
        port: env.RABBIT_MQ_PORT || 5672,
        login: env.RABBIT_MQ_USERNAME || "abstract",
        password: env.RABBIT_MQ_PWD || "617EC7A6-60F8-4C2E-ADF1-667D0905D6D2",
        vhost: env.RABBIT_MQ_VHOST || "vabstract",
    };
    if(config.confFilePath){
        try{
            properties = PropertiesReader(process.cwd() + config.confFilePath);
            const userName = properties.get("mongo.global.username"),
                password = properties.get("mongo.global.password"),
                host = properties.get("mongo.global.host"),
                port = properties.get("mongo.global.port"),
                db = properties.get("mongo.global.db");
            config.dbURI = `mongodb://${userName}:${password}@${host}:${port}/${db}`;
            Object.assign(config, properties.getAllProperties());
        }catch(e){
            console.error("Failed to load config file", e);
        }
    }
    return config;
}

module.exports = config;
module.exports.configure = configure;