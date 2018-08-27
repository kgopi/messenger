const url = require("url");

function CloseHandler(origin){
    return function(){
        this.isAlive = false;
        console.log(`${new Date()} ${origin} disconnected.`);
    }
}

function processRequest(client, req){
    let query = url.parse(req.url, true).query;
    if(query.b2b){
        client.server = true;
    }
    const tenantId = client.tenantId = req.headers.tenantId;
    client.userId = req.headers.userId;
    console.log(`Tenant ${tenantId} successfully registered for client ${client.id}`);
    require("./../app/db/models").getEventsModel(tenantId).find(
        {$or: [ {"targetUsers": { $size: 0 } }, {"targetUsers": {$in: [client.userId]} } ] },
        function (err, docs) {
            if(err){
                console.log("Failed to query notification on onnection", err);
            }else{
                client.emit("messages", docs.map((model)=>{return model._doc}));
                console.log(`Successfully notified the messeages for user: ${client.userId}`);
            }
        }
    );
}

module.exports = function(client) {
    var req = client.request;
    console.log(`${new Date()} connection from origin ${req.headers.origin} with id ${client.id}.`);
    processRequest(client, req);
    client.on('disconnect', CloseHandler(req.origin).bind(client));
}