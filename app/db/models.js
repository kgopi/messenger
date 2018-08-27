const mongoose = require("mongoose");
const schemas = require("./schema");

module.exports = {
    getEventsModel: function(tenantId){
        tenantId = tenantId.replace(/-/g, "");
        return mongoose.model('messenger_event_'+tenantId, schemas.EventSchema);
    }
}