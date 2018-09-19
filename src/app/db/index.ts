import mongoose = require("mongoose");
import {config} from "./../../config";

module.exports = {
    connect: function(cb){
        mongoose.connect(
            config.dbURI, {
                keepAlive: true, 
                keepAliveInitialDelay: 300000,
                poolSize: 4,
                socketTimeoutMS: 0,
                reconnectTries: 30,
                useNewUrlParser: true
            }, function(err) {
                if(err){
                    console.error("DB connection failed", err);
                }else{
                    console.log("Mongo DB connection successfull");
                }
                cb && cb.call(arguments);
            }
        );
    }
}