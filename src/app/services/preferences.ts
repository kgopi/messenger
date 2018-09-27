import {Preferences} from "../db/models";
import {db} from "../db";
import * as _ from 'lodash';
import {default as defaultPreferences} from "./../../config/default_user_preferences";

export module PreferencesService{

    function rawInsert({tenantId, params, userId, callback}){
        const query = Preferences.insert(params).returning(Preferences.star()).toQuery();
        db.connect(tenantId).query(query.text, query.values, callback);
    }

    function rawUpdate({tenantId, params, userId, callback}){
        const query = Preferences.update(params).where(Preferences.userId.equals(userId)).returning(Preferences.star()).toQuery();
        db.connect(tenantId).query(query.text, query.values, callback);
    }
    
    export function get({tenantId, userId, callback}, defaults?:any){
        var query = Preferences.select(Preferences.star()).where(Preferences.userId.equals(userId)).toQuery();
        db.connect(tenantId).query(query.text, query.values, (err, res)=>{
            if(err){
                callback(err);
            }else{
                if(res.rows[0]){
                    callback(err, res);
                }else{
                    let params = _.merge({userId, isAdmin: false, data: defaultPreferences}, defaults);
                    rawInsert({tenantId, params, userId, callback});
                }
            }
        });
    }

    export function update({tenantId, params, userId, callback}){
        get({tenantId, userId, callback: (err, res)=>{
            if(err){
                callback(err);
            }else{
                const exsistingData = res.rows[0];
                rawUpdate({tenantId, params: _.merge(exsistingData, params), userId, callback});
            }
        }}, params);
    }

}