export var config:any = initConfig(process.env);

export function initConfig(env) {
    let _config:any = {};
    _config.appName = "informer";
    _config.environment = env.ENV || 'prod';
    _config.listenPort = env.API_LISTEN_PORT || 8880;
    _config.mdaSecretKeyPassword = env.MDA_SECRET_KEY_PWD || "69afc10c0920e48705da806ffb3b010b1b072968f27fbcd0b82c3294396208b9";
    _config.mdaSecretKey = env.MDA_SECRET_KEY || "abc";
    _config.workers = Number(env.SOCKETCLUSTER_WORKERS) || 1 || require('os').cpus().length;
    _config.brokers = Number(env.SOCKETCLUSTER_BROKERS) || 1;
    _config.socketChannelLimit = Number(env.SOCKETCLUSTER_SOCKET_CHANNEL_LIMIT) || 1000;
    _config.rabbitmq = {
        host: env.RABBIT_MQ_HOST || '52.5.151.198',
        port: env.RABBIT_MQ_PORT || 5672,
        login: env.RABBIT_MQ_USERNAME || "abstract",
        password: env.RABBIT_MQ_PWDl,
        vhost: env.RABBIT_MQ_VHOST || "vabstract",
    };
    _config.dbURI = env.PGSQL_DB_CONNECTION_URL;
    _config.minDBConnections = env.PGSQL_DB_MIN_CONNECTIONS || 1;
    _config.maxDBConnections = env.PGSQL_DB_MAX_CONNECTIONS || 2;
    return config = _config;
}