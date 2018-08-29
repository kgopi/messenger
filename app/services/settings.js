const getSettings = require("./../controllers/settings").get;

module.exports = {
    get: (req, res, next)=>{
        getSettings({userId: req.headers.userId, tenantId: req.headers.tenantId}, (err, doc)=>{
            if(err){
                console.log("Failed to fetch notification settings", err);
                res.status(400).json({result: false, message: "Failed to fetch notification settings for the user."});
            }else{
                res.status(200).json({result: true, data: doc});
            }
        });
        next();
    }
}