import {PreferencesService} from './../app/services/preferences';

function getSettings({userId, tenantId}, callback){
  PreferencesService.get({tenantId, userId, callback});
}

function isEligibleForInAppNotifications(settings, data){
  if(settings.data.channelSubscriptions.inApp.isEnabled){
    let areaSettings = settings.data.eventSubscriptions[data.area];

    if(areaSettings == null){
      console.log(`Area (${data.area}) is missing`);
      return false;
    }

    if(areaSettings.inApp){
      if(areaSettings.events[data.name] == null || areaSettings.events[data.name].inApp){
        return true;
      }else{
        console.log(`Inapp notifications are disabled for the event ${data.name}, user ${settings.userId}`);
        return false;
      }
    }else{
      console.log(`Inapp notifications are disabled for the area ${data.area}, user ${settings.userId}`);
      return false;
    }
  }else{
    console.log(`Inapp notifications are disabled for user ${settings.userId}`);
    return false;
  }
}

export function PublishOutHandler(req, next) {

    const targetUserId = req.socket.userId;
    const notifierUserId = req.data.actorId;

    if(req.socket.tenantId != req.data.tenantId){
      console.log(`Invalid target-tenant (${req.socket.tenantId}) to listen the event of tenant ${req.data.tenantId}`);
      return next(true);
    }

    if(/^broadcast/.test(req.channel) && targetUserId === notifierUserId){
      console.info(`User ${targetUserId} is not eligible for listening his own event`);
      next(true);
    }else{
      getSettings({userId: targetUserId, tenantId: req.socket.tenantId}, (err, settingsData)=>{
        if(err){
          return next(err);
        }else if(settingsData.rows[0]){
          if(isEligibleForInAppNotifications(settingsData.rows[0], req.data)){
            console.log("Eligible criteria is met");
            next();
          }else{
            next(true);
          }
          return;
        }
        console.log("Preferences are missing");
        next(true);
      });
    }
}