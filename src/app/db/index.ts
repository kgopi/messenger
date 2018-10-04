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
    return ()=>{
        AppCache.set(tenantId, {dbUri, connection: null});
    }
}

function connect2PGSql(tenantId, dbUri) {

    debugger;

    let connection = anyDb.createPool(dbUri, {
        min: config.minDBConnections,
        max: config.maxDBConnections
    });

    connection.on('error', errorHandler({tenantId, dbUri}));
    connection.on('close', errorHandler({tenantId, dbUri}));

    return new Promise((resolve, reject)=>{
        AppCache.set(tenantId, {dbUri, connection}, function(err, success) {
            if( !err && success ){
                resolve(connection);
            } else {
                reject(err);
            }
        });
    });
}

function fetchDbDetails(req){
    return new Promise((resolve, reject)=>{
        request.get(config.mdaHost + '/v1.0/api/gsnap/dbdetails', {headers: {secret: req.headers.secret, requestinfo: req.headers.requestinfo}}, (err, data)=>{
            try {
                if(err || data.statusCode != 200) {
                    return console.error('MDA db-details api request failed, reason: ', err || data.body);
                }else{
                    console.info('MDA db-details api response, reason: ', data.body);
                }

                var _responseBody = JSON.parse(data.body);
                if(_responseBody.result === true) {
                    let decryptObj  = JSON.parse(cryptor.decrypt(_responseBody.data));
                    let dbDetails = decryptObj.postgresDBDetail.dbServerDetails[0];
                    let dbUri = `postgres://${dbDetails.userName}:${encodeURIComponent(dbDetails.password)}@${dbDetails.host}/${decryptObj.postgresDBDetail.dbName}`;
                    connect2PGSql(req.headers.tenantId, dbUri).then(resolve, reject);
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
    export function connect(tenantId:string):Promise<anyDb.ConnectionPool> {
        return new Promise((resolve, reject)=>{
            AppCache.get(tenantId, (err, data:any) => {
                if(data == null) {
                    //fetchDbDetails(req).then(resolve, reject);
                }else if(data.connection == null){
                    connect2PGSql(tenantId, data.dbUri).then(resolve, reject);
                }else{
                    resolve(data.connection);
                }
            });
        });
    }

    export function initDb(req, res, next){
        AppCache.get(req.headers.tenantId, (err, data) => {
            if(data === undefined) {
                // Cache Missed. Either Failed or not found
                // If cache is missed ? we make call to MDA
                fetchDbDetails(req).then((data)=>{
                    next();
                }, (err)=>{
                    next(err);
                });
            } else {
                next();
            }
        });
    }
}