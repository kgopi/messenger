var url = require("url");

function MessageHandler(wss, ws){
    return function(message){
        console.log('received: %s', message);
        broadCastMessage(message, wss, ws);
    }
}

function CloseHandler(origin){
    return function(){
        this.isAlive = false;
        if(tenantClientMap[this.tenantId]){
            const clientIndex = tenantClientMap[this.tenantId].indexOf(this);
            clientIndex >= 0 && tenantClientMap[this.tenantId].splice(clientIndex, 1);
        }
        console.log(`${new Date()} ${origin} disconnected.`);
    }
}

function broadCastMessage(m, wss, ws){
    try{
        let message = JSON.parse(m);
        if(ws.server && message.tenantId && tenantClientMap[message.tenantId]){
            tenantClientMap[message.tenantId].forEach(client => {
                if(client.isAlive && client.readyState === client.OPEN){
                    client.send(m);
                }
            });
        }
    }catch(e){
        console.error("Failed to parse incoming message", e);
    }
}

const tenantClientMap = {};
function registerClient(tenantId, client){
    client.tenantId = tenantId;
    if(tenantClientMap[tenantId] == null){
        tenantClientMap[tenantId] = [client];
    }else{
        tenantClientMap[tenantId].push(client);
    }
}

function processRequest(ws, req){
    let query = url.parse(req.url, true).query;
    const tenantId = query.id;
    if(query.server){ // ##TODO, logic to identify the server (B2B auth)
        ws.server = true;
    }else if(tenantId){
        registerClient(tenantId, ws);
        console.log(`Tenant ${tenantId} successfully registered from origin ${req.headers.origin}`);
    }else{
        ws.terminate();
        console.warn(`${new Date()} Tenant miss for the connection from ${req.url}.`);
    }
}

module.exports = (wss) => {
    return (ws, req) => {
        console.log(`${new Date()} Connection from origin ${req.headers.origin}. Client: ${wss.clients.size}`);
        processRequest(ws, req);
        ws.isAlive = true;
        ws.on('pong', () => {
            ws.isAlive = true;
        });
        ws.on('message', MessageHandler(wss, ws));
        ws.on('close', CloseHandler(req.headers.origin).bind(ws));
    };
}