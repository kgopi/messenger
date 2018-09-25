import {Preferences} from "../db/models";
import {db} from "../db";
import * as defaultPreferences from "./../../config/default_user_preferences";

export module PreferencesService{

    function rawInsert({tenantId, params, userId, callback}){
        const query = Preferences.insert(params).returning(Preferences.start()).toQuery();
        db.connect(tenantId).query(query.text, query.values, callback);
    }

    function rawUpdate({tenantId, params, userId, callback}){
        const query = Preferences.update(params).where(Preferences.userId.equals(userId)).returning(Preferences.start()).toQuery();
        db.connect(tenantId).query(query.text, query.values, callback);
    }
    
    export function get({tenantId, userId, callback}){
        var query = Preferences.get(Preferences.star()).where(Preferences.userId.equals(userId)).toQuery();
        db.connect(tenantId).query(query.text, query.values, (err, res)=>{
            if(err){
                callback(err);
            }else{
                if(res.rows[0]){
                    callback(err, res);
                }else{
                    rawInsert({tenantId, params: defaultPreferences, userId, callback});
                }
            }
        });
    }

    export function update({tenantId, params, userId, callback}){
        get({tenantId, userId, callback: (err, res)=>{
            if(err){
                callback(err);
            }else{
                const {data} = res.rows[0];
                Object.assign(params, data);
                rawUpdate({tenantId, params, userId, callback});
            }
        }});
    }

}