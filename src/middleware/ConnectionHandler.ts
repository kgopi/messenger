import url = require("url");
import {EventService} from "./../app/services/event";

function CloseHandler(origin){
    return function(){
        this.isAlive = false;
        console.log(`${new Date()} ${this.tenantId} ${this.userId} disconnected.`);
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
    EventService.list({
        tenantId, 
        userId:client.userId, 
        callback: (err, result)=>{
            if(err){
                console.log("Failed to query notification on onnection", err);
            }else{
                client.emit("messages", result.rows);
                console.log(`Successfully notified the messeages for user: ${client.userId}`);
            }
        }
    });
}

export default function(client) {
    var req = client.request;
    console.log(`${new Date()} connection from origin ${req.headers.origin} with id ${client.id}.`);
    processRequest(client, req);
    client.on('disconnect', CloseHandler(req.origin).bind(client));
}