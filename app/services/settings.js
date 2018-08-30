const Settings = require("./../controllers/settings");
const BaseError = require("./../utils/error").BaseError;

module.exports = {
    get: (req, res, next)=>{
        Settings.getUserSettings({userId: req.headers.userId, tenantId: req.headers.tenantId}).then((doc)=>{
            if(doc == null){
                Settings.getGlobalSettings({tenantId: req.headers.tenantId}, req.body).then((gdoc)=>{
                    res.status(200).json({result: true, data: gdoc});
                });
            }else{
                res.status(200).json({result: true, data: doc});
            }
        }).catch(err=>{
            next(new BaseError(400, `Failed to fetch notification settings for the user ${req.headers.userId}`, err));
        });
    },
    update: (req, res, next)=>{
        Settings.updateUserSettings({userId: req.headers.userId, tenantId: req.headers.tenantId}, req.body).then((doc)=>{
            res.status(201).json({result: true, data: doc});
        }).catch(err=>{
            next(new BaseError(400, `Failed to update notification settings for ${req.headers.userId}`, err));
        });
    }
}