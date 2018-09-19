import mongoose = require("mongoose");
import {EventSchema, UserPreferencesSchema, GlobalPreferencesSchema} from "./schema";

export module Models{
    export function getEventsModel(tenantId){
        tenantId = tenantId.replace(/-/g, "");
        return mongoose.model('messenger_event_'+tenantId, EventSchema);
    };

    export function getUserPreferencesModel(tenantId){
        tenantId = tenantId.replace(/-/g, "");
        return mongoose.model('messenger_user_preferences_'+tenantId, UserPreferencesSchema);
    };

    export function getGlobalPreferencesModel(){
        return mongoose.model('messenger_global_preferences', GlobalPreferencesSchema);
    }
}