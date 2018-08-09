
const config = {};

function configure(env) {
    config.listenPort = env.API_LISTEN_PORT || 8880;
    config.mdaSecretKeyPassword = env.MDA_SECRET_KEY_PWD || "69afc10c0920e48705da806ffb3b010b1b072968f27fbcd0b82c3294396208b9";
    config.mdaSecretKey = env.MDA_SECRET_KEY || "abc";
    return config;
}

module.exports = config;
module.exports.configure = configure;