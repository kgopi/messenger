import * as anyDb from 'any-db';
import * as pg from 'pg';
import {config} from "./../../config";
import {default as cryptor} from "./../utils/encryption";
import request  = require('request');
import NodeCache = require( "node-cache");

// Required to avoid double conversion (date)
const types = pg.types;
const timestampOID = 1114;
types.setTypeParser(timestampOID, function(stringValue) {
    return stringValue ? new Date(stringValue).getTime() : stringValue;
});

const AppCache = new NodeCache({stdTTL : 3600, checkperiod: 120});

function errorHandler({tenantId, dbUri}){
    return (err)=>{
        console.log("DB connection closed", err);
        AppCache.set(dbUri, {connection: null});
        AppCache.set(tenantId, {dbUri, connection: null});
    }
}

function connect2PGSql(tenantId, dbUri) {

    let connection = anyDb.createPool(dbUri, {
        min: config.minDBConnections,
        max: config.maxDBConnections
    });

    console.log(`Established DB connection for the tenant ${tenantId}`);

    connection.on('error', errorHandler({tenantId, dbUri}));
    connection.on('close', errorHandler({tenantId, dbUri}));

    AppCache.set(tenantId, {connection, dbUri});
    AppCache.set(dbUri, {connection});

    return connection;
}

function fetchDbDetails(req){

    let data:any = AppCache.get(req.headers.tenantId);
    if(data != null && data.dbUri != null){
        return Promise.resolve(data.dbUri);
    }

    return new Promise((resolve, reject)=>{
        request.get(config.mdaHost + '/v1.0/api/gsnap/dbdetails', {headers: {secret: req.headers.secret, requestinfo: req.headers.requestinfo}}, (err, data)=>{
            try {
                if(err || data.statusCode != 200) {
                    return req.log.error('MDA db-details api request failed, reason: ', err || data.body);
                }else{
                    req.log.info('Successully fetched the db deatils');
                }

                var _responseBody = JSON.parse(data.body);
                if(_responseBody.result === true) {
                    let decryptObj  = JSON.parse(cryptor.decrypt(_responseBody.data));
                    let dbDetails = decryptObj.postgresDBDetail.dbServerDetails[0];
                    let dbUri = `postgres://${dbDetails.userName}:${encodeURIComponent(dbDetails.password)}@${dbDetails.host}/${decryptObj.postgresDBDetail.dbName}`;
                    resolve(dbUri);
                } else {
                    reject();
                }
            } catch(e) {
                reject(e);
            }
        });
    });
}

export module db{
    export function connect(tenantId:string, req?:Request):Promise<anyDb.ConnectionPool> {
        return new Promise((resolve, reject)=>{
            const data:any = AppCache.get(tenantId);
            if(data == null) {
                req ? fetchDbDetails(req).then((dbUri)=>{
                    const connection = connect2PGSql(tenantId, dbUri);
                    connection ? resolve(connection) : reject("DB connection failed");
                }, reject) : reject("Request object is missing");
            }else if(data.connection == null){
                const connection = connect2PGSql(tenantId, data.dbUri);
                connection ? resolve(connection) : reject("DB connection failed");
            }else{
                resolve(data.connection);
            }
        });
    }

    export function initDb(req, res, next){
        connect(req.headers.tenantId, req).then((connection)=>{
            const tenantId = req.headers.tenantId.replace(/-/g, '');
            connection.query(`select create_messenger_entities('${tenantId}')`, null, (err)=>{
                if(err){
                    res.status(400).json({result: false, err});
                }else{
                    res.status(200).json({result: true});
                }
            });
        });
    }
}