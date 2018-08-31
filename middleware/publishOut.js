const Settings = require("./../app/controllers/settings");

function getSettings({userId, tenantId}, cb){
  Promise.all([Settings.getGlobalSettings({tenantId}), Settings.getUserSettings({userId, tenantId})])
  .then(results=>{
    cb(null, {global: results[0].toJSON(), user: results[1] ? results[1].toJSON() : {}});
  }).catch(err=>{
    cb(err);
  });
}

function eligibleForInAppNotifications(settings, data){
  if(settings.global.inApp.enabled){
    settings.user && (settings = Object.assign(settings.global, settings.user));
    if(settings.inApp.areas[data.area.toLowerCase()]){
      return true;
    }else{
      console.log(`Inapp notifications are disabled for area ${data.area.toLowerCase()}, user ${data.userId}`);
      return false;
    }
  }else{
    console.log(`Inapp notifications are disabled for user ${data.userId}`);
    return false;
  }
}

module.exports = (req, next) => {
    const targetUserId = req.socket.userId;
    const notifierUserId = req.data.userId;

    if(req.socket.tenantId != req.data.tenantId){
      console.log(`Invalid target-tenant (${req.socket.tenantId}) to listen the event of tenant ${req.data.tenantId}`);
      return next(true);
    }

    if(/^broadcast/.test(req.channel) && targetUserId === notifierUserId){
      console.info(`User ${targetUserId} is not eligible for listening his own event`);
      next(true);
    }else{
      getSettings({userId: targetUserId, tenantId: req.socket.tenantId}, (err, settings)=>{
        if(err){
          return next(err);
        }
        const allowInAppNotifications = eligibleForInAppNotifications(settings, req.data);
        allowInAppNotifications ? next() : next(true);
      });
    }
}