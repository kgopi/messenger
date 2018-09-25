import * as anyDb from 'any-db';
import * as pg from 'pg';
import {config} from "./../../config";

const connections:Map<String, anyDb.ConnectionPool> = new Map();

// Required to avoid double conversion (date)
const types = pg.types;
const timestampOID = 1114;
types.setTypeParser(timestampOID, function(stringValue) {
    return stringValue;
});

export module db{

    function parseTenantId(tenantId:string){
        return tenantId.replace(/_/g, '');
    }

    export function connect(tenantId:string):anyDb.ConnectionPool {

        tenantId = parseTenantId(tenantId);

        if(connections.get(tenantId)){
            return connections.get(tenantId);
        }

        let connection = anyDb.createPool(`${config.dbURI}`, {
            min: config.minDBConnections,
            max: config.maxDBConnections
        });

        connections.set(tenantId, connection);

        return connection;
    }

    export function disconnect(tenantId, callback) {
        
         tenantId = parseTenantId(tenantId);

        if(tenantId && connections.get(tenantId)) {
            connections.get(tenantId).close(function() {
                connections.delete(tenantId);
                callback();
            });
        }
    }
};