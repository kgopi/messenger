const ModelFactory = require("./../db/models");

module.exports = {
    getGlobalSettings: ({tenantId})=>{
        const settingsModel = ModelFactory.getGlobalPreferencesModel();
        return settingsModel.findOneAndUpdate(
                    {tenantId},
                    {tenantId},
                    {upsert: true, new: true, setDefaultsOnInsert: true}).exec();
    },
    getUserSettings: ({userId, tenantId})=>{
        const settingsModel = ModelFactory.getUserPreferencesModel(tenantId);
        return settingsModel.findOneAndUpdate(
            {userId},
            {userId, tenantId},
            {upsert: true, new: true, setDefaultsOnInsert: true}).exec();
    },
    updateUserSettings: ({userId, tenantId}, data)=>{
        const settingsModel = ModelFactory.getUserPreferencesModel(tenantId);
        return settingsModel.findOneAndUpdate({userId}, data, {new: true}).exec();
    }
}