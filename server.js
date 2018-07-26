const fs = require('fs');

const https = require('https');
const server = new https.createServer({
    cert: fs.readFileSync('./cert.pem'),
    key: fs.readFileSync('./key.pem')
});
server.listen(process.env.PORT || 8880, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
    noServer: true,
    autoAcceptConnections: false,
    verifyClient: require("./middleware/VerifyClinent")
});

server.on('upgrade', require("./middleware/UpgradeHandler")(wss));
wss.on('connection', require("./middleware/ConnectionHandler")(wss));
require("./middleware/ConnectionManager")(wss);