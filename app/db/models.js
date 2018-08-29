const mongoose = require("mongoose");
const schemas = require("./schema");

module.exports = {
    getEventsModel: function(tenantId){
        tenantId = tenantId.replace(/-/g, "");
        return mongoose.model('messenger_event_'+tenantId, schemas.EventSchema);
    },
    getUserPreferencesModel: function(tenantId){
        tenantId = tenantId.replace(/-/g, "");
        return mongoose.model('messenger_user_preferences_'+tenantId, schemas.UserPreferencesSchema);
    },
    getGlobalPreferencesModel: function(){
        return mongoose.model('messenger_global_preferences', schemas.GlobalPreferencesSchema);
    }
}