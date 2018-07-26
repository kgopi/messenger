var url = require("url");

function MessageHandler(message){
    console.log('received: %s', message);
}

function CloseHandler(origin){
    return function(){
        this.isAlive = false;
        const clientIndex = tenantClientMap[this.tenantId].indexOf(this);
        clientIndex >= 0 && tenantClientMap[this.tenantId].splice(clientIndex, 1);
        console.log(`${new Date()} ${origin} disconnected.`);
    }
}

function initFakeNotification(wss, ws){
    setInterval(()=>{
        if(tenantClientMap[ws.tenantId]){
            tenantClientMap[ws.tenantId].forEach(client => {
                if(client.isAlive){
                    client.send(`Hello, broadcast message`);
                }
            });
        }
    }, 2 * 60 * 60);
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
    const tenantId = url.parse(req.url, true).query.id;
    if(tenantId){
        registerClient(tenantId, ws);
        console.log(`Tenant ${tenantId} successfully registered fro origin ${req.headers.origi}`);
    }else{
        ws.terminate();
        console.warn(`${new Date()} Tenant miss for the connection from ${req.url}.`);
    }
}

module.exports = (wss) => {
    return (ws, req) => {
        console.log(`${new Date()} Connection from origin ${req.headers.origin}. Client: ${wss.clients.size}`);
        //initFakeNotification(wss, ws);
        processRequest(ws, req);
        ws.isAlive = true;
        ws.on('pong', () => {
            ws.isAlive = true;
        });
        ws.on('message', MessageHandler);
        ws.on('close', CloseHandler(req.headers.origin).bind(ws));
    };
}