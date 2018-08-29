const ModelFactory = require("./../db/models");

module.exports = {
    getGlobalSettings: ({tenantId}, cb)=>{
        const settingsModel = ModelFactory.getGlobalPreferencesModel();
        return settingsModel.findOneAndUpdate(
                    {tenantId},
                    {tenantId},
                    {upsert: true, new: true, setDefaultsOnInsert: true}).exec();
    },
    getUserSettings: ({userId, tenantId}, cb)=>{
        const settingsModel = ModelFactory.getUserPreferencesModel(tenantId);
        return settingsModel.findOne({userId}).exec();
    }
}