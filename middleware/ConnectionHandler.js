const url = require("url");

function MessageHandler(client){
    return function(data){
        console.log('received: %s', data, process.id);
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

function broadCastMessage(data){
    try{
        let message = JSON.parse(data);
        if(data.filters && data.filters.users){
            data.filters.users.forEach(userId => {
                client.server.exchange.publish(`broadcast/${message.tenantId}/${message.userId}`, data);
            });
        }else{
            client.server.exchange.publish(`broadcast/${message.tenantId}`, data);
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

function processRequest(client, req){
    let query = url.parse(req.url, true).query;
    if(query.b2b){
        client.server = true;
    }
    const tenantId = client.tenantId = req.headers.tenantId;
    client.userId = req.headers.userId;
    registerClient(tenantId, client);
    console.log(`Tenant ${tenantId} successfully registered for client ${client.id}`);
}

module.exports = function(client) {
    var req = client.request;
    console.log(`${new Date()} connection from origin ${req.headers.origin} with id ${client.id}.`);
    processRequest(client, req);
    client.on('yoyo', MessageHandler(client));
    client.on('disconnect', CloseHandler(req.origin).bind(client));
}