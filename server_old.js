const fs = require('fs');

const http = require('http');

const server = new http.createServer();
server.listen(process.env.PORT || 8880, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});

const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({
    noServer: true,
    autoAcceptConnections: false,
    verifyClient: require("./middleware/VerifyClinent")
});

server.on('upgrade', require("./middleware/UpgradeHandler")(wss));
wss.on('connection', require("./middleware/ConnectionHandler")(wss));
require("./middleware/ConnectionManager")(wss);